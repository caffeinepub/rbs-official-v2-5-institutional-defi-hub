import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type MarketIntelligence = {
    id : Nat;
    asset : Text;
    timeframe : Text;
    indicators : [TechnicalIndicator];
    overallSignal : SignalConfidence;
    historicalAccuracy : Float;
    timestamp : Int;
  };

  public type FormSubmission = {
    id : Nat;
    name : Text;
    country : Text;
    walletAddress : Text;
    rbsAmount : Float;
    isPresale : Bool;
    timestamp : Int;
    submittedBy : Principal;
  };

  public type TimerType = {
    #presale;
    #airdrop;
  };

  public type TimerState = {
    isUnlocked : Bool;
    endTime : Int;
    lastUpdate : Int;
  };

  public type IndicatorType = {
    #rsi;
    #macd;
    #bollingerBands;
    #vwap;
    #movingAverage;
    #fvg;
    #orderBlocks;
  };

  public type SignalConfidence = {
    #strongBuy;
    #buy;
    #neutral;
    #sell;
    #strongSell;
  };

  public type TechnicalIndicator = {
    indicatorType : IndicatorType;
    value : Float;
    signal : SignalConfidence;
  };

  public type ContactFormSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  public type CallAction = {
    #androidApp;
    #iosApp;
    #webApp;
    #extension;
    #group;
    #broadcast;
  };

  public type Alert = {
    id : Nat;
    title : Text;
    message : Text;
    timestamp : Int;
    read : Bool;
  };

  // State Variables
  let userProfiles = Map.empty<Principal, UserProfile>();
  let submissions = Map.empty<Nat, FormSubmission>();
  let timers = Map.empty<Text, TimerState>();
  let marketIntelAccess = Map.empty<Principal, Int>();
  let marketIntelligenceStore = Map.empty<Nat, MarketIntelligence>();

  var currentId = 0;
  var nextMIId = 1;
  var lastAlertId = 0;
  let maxSubmissions = 5000;
  let marketIntelPassword : Text = "PB2420075112009PB";
  let presaleEndTime : Int = 1_789_434_800_000_000_000;
  let airdropEndTime : Nat = 2_252_772_800_000_000_000;

  let alertsStore = Map.empty<Principal, [Alert]>();

  // Transformation Method (required for HTTP calls)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Alerts
  public shared ({ caller }) func addAlert(title : Text, message : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add alerts");
    };

    let alertId = lastAlertId + 1;
    lastAlertId += 1;

    let alert : Alert = {
      id = alertId;
      title;
      message;
      timestamp = Time.now();
      read = false;
    };

    var existingAlerts = switch (alertsStore.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };

    existingAlerts := existingAlerts.concat([alert]);
    alertsStore.add(caller, existingAlerts);

    alertId;
  };

  public query ({ caller }) func getAlerts() : async [Alert] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view alerts");
    };

    switch (alertsStore.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };
  };

  public shared ({ caller }) func markAlertAsRead(alertId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can mark alerts as read");
    };

    let alerts = switch (alertsStore.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };

    let updatedAlerts = alerts.map(
      func(alert) {
        {
          id = alert.id;
          title = alert.title;
          message = alert.message;
          timestamp = alert.timestamp;
          read = if (alert.id == alertId) { true } else { alert.read };
        };
      }
    );

    alertsStore.add(caller, updatedAlerts);
  };

  public shared ({ caller }) func deleteAlert(alertId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can delete alerts");
    };

    let alerts = switch (alertsStore.get(caller)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };

    let filteredAlerts = alerts.filter(func(alert) { alert.id != alertId });
    alertsStore.add(caller, filteredAlerts);
  };

  public shared ({ caller }) func clearAlerts() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can clear alerts");
    };

    alertsStore.remove(caller);
  };

  public query ({ caller }) func getAlertCount() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view alert count");
    };

    switch (alertsStore.get(caller)) {
      case (null) { 0 };
      case (?alerts) { alerts.size() };
    };
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Timer Queries (Public - intentional for public website)
  public query func getPresaleRemainingTime() : async Int {
    let now = Time.now();
    if (presaleEndTime < now) { 0 } else { presaleEndTime - now };
  };

  public query func getAirdropRemainingTime() : async Int {
    let now = Time.now();
    if (airdropEndTime < now) { 0 } else { airdropEndTime - now };
  };

  public query func getTimerState(timerType : TimerType) : async ?TimerState {
    let timerKey = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };
    timers.get(timerKey);
  };

  public shared ({ caller }) func toggleTimer(timerType : TimerType) : async TimerState {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can toggle timer states");
    };

    let timerKey = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };

    let currentTime = Time.now();
    let timerState = switch (timers.get(timerKey)) {
      case (null) {
        let endTime = if (timerType == #presale) { presaleEndTime } else { airdropEndTime };
        { isUnlocked = false; endTime; lastUpdate = currentTime };
      };
      case (?existing) {
        {
          isUnlocked = not existing.isUnlocked;
          endTime = existing.endTime;
          lastUpdate = currentTime;
        };
      };
    };
    timers.add(timerKey, timerState);
    timerState;
  };

  public shared ({ caller }) func updateTimer(timerType : TimerType, isUnlocked : Bool, endTime : Int) : async TimerState {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update timers");
    };

    let timerKey = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };

    let newState : TimerState = {
      isUnlocked;
      endTime;
      lastUpdate = Time.now();
    };
    timers.add(timerKey, newState);
    newState;
  };

  public shared ({ caller }) func deleteTimer(timerType : TimerType) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete timers");
    };

    let timerKey = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };

    timers.remove(timerKey);

    let newTimer : TimerState = switch (timerType) {
      case (#presale) { { isUnlocked = false; endTime = presaleEndTime; lastUpdate = Time.now() } };
      case (#airdrop) { { isUnlocked = false; endTime = airdropEndTime; lastUpdate = Time.now() } };
    };

    timers.add(timerKey, newTimer);
  };

  // Market Intel Access Control
  func hasMarketIntelAccess(caller : Principal) : Bool {
    marketIntelAccess.containsKey(caller);
  };

  // Checks if the caller has access to the full Market Intelligence suite
  func hasFullMarketIntelAccess(caller : Principal) : Bool {
    hasMarketIntelAccess(caller);
  };

  public shared ({ caller }) func grantMarketIntelAccess(password : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can request Market Intel access");
    };

    if (password != marketIntelPassword) {
      return false;
    };

    marketIntelAccess.add(caller, Time.now());
    true;
  };

  public shared ({ caller }) func revokeMarketIntelAccessWithPassword(password : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can revoke Market Intel access");
    };

    if (password != marketIntelPassword) {
      return false;
    };

    switch (marketIntelAccess.get(caller)) {
      case (?_) {
        marketIntelAccess.remove(caller);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func checkMarketIntelAccess() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check Market Intel access");
    };
    hasMarketIntelAccess(caller);
  };

  // AI Sentiment Access is always enabled for all users
  public query ({ caller }) func hasAISentimentAccess() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can check AI Sentiment access");
    };
    true;
  };

  public shared ({ caller }) func submitForm(name : Text, country : Text, walletAddress : Text, rbsAmount : Float, isPresale : Bool) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can submit forms");
    };

    let id = currentId + 1;
    currentId += 1;

    let submission : FormSubmission = {
      id;
      name;
      country;
      walletAddress;
      rbsAmount;
      isPresale;
      timestamp = Time.now();
      submittedBy = caller;
    };

    submissions.add(id, submission);
    id;
  };

  public query ({ caller }) func getFormSubmission(id : Nat) : async ?FormSubmission {
    switch (submissions.get(id)) {
      case (null) { null };
      case (?submission) {
        if (submission.submittedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own submissions or be an admin");
        };
        ?submission;
      };
    };
  };

  public query ({ caller }) func getAllSubmissions() : async [FormSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };
    let iter = submissions.values();
    iter.toArray();
  };

  public query ({ caller }) func getSubmissionsByType(isPresale : Bool) : async [FormSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view submissions by type");
    };

    let allSubmissions = submissions.values().toArray();
    allSubmissions.filter(
      func(submission) {
        submission.isPresale == isPresale;
      }
    );
  };

  public query ({ caller }) func getSubmissionsByCountry(country : Text) : async [FormSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view submissions by country");
    };

    let allSubmissions = submissions.values().toArray();
    allSubmissions.filter(
      func(submission) {
        submission.country == country;
      }
    );
  };

  public query ({ caller }) func getMySubmissions() : async [FormSubmission] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view their submissions");
    };

    let allSubmissions = submissions.values().toArray();
    allSubmissions.filter(
      func(submission) {
        submission.submittedBy == caller;
      }
    );
  };

  public shared ({ caller }) func deleteSubmission(id : Nat) : async () {
    switch (submissions.get(id)) {
      case (null) {
        Runtime.trap("Submission does not exist");
      };
      case (?submission) {
        if (submission.submittedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own submissions or be an admin");
        };
        submissions.remove(id);
      };
    };
  };

  public shared ({ caller }) func updateSubmission(id : Nat, name : Text, country : Text, walletAddress : Text, rbsAmount : Float, isPresale : Bool) : async () {
    switch (submissions.get(id)) {
      case (null) {
        Runtime.trap("Submission does not exist");
      };
      case (?existing) {
        if (existing.submittedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own submissions or be an admin");
        };

        let updated : FormSubmission = {
          id;
          name;
          country;
          walletAddress;
          rbsAmount;
          isPresale;
          timestamp = existing.timestamp;
          submittedBy = existing.submittedBy;
        };
        submissions.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getSubmissionsCount() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view submission statistics");
    };
    submissions.size();
  };

  // Market Intelligence (Admin only for creation)
  public shared ({ caller }) func generateMarketIntel(asset : Text, timeframe : Text, indicators : [TechnicalIndicator], overallSignal : SignalConfidence, historicalAccuracy : Float) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can generate market intelligence");
    };

    let id = nextMIId;
    nextMIId += 1;

    let entry : MarketIntelligence = {
      id;
      asset;
      timeframe;
      indicators;
      overallSignal;
      historicalAccuracy;
      timestamp = Time.now();
    };

    marketIntelligenceStore.add(id, entry);
    id;
  };

  public query ({ caller }) func getMarketIntelligence(id : Nat) : async ?MarketIntelligence {
    if (not hasFullMarketIntelAccess(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };
    marketIntelligenceStore.get(id);
  };

  public query ({ caller }) func getAllMarketIntelligence() : async [MarketIntelligence] {
    if (not hasFullMarketIntelAccess(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };
    let iter = marketIntelligenceStore.values();
    iter.toArray();
  };

  public query ({ caller }) func getMarketIntelligenceByTimeframe(timeframe : Text) : async [MarketIntelligence] {
    if (not hasFullMarketIntelAccess(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };

    let allMarketIntelligence = marketIntelligenceStore.values().toArray();
    allMarketIntelligence.filter(
      func(entry) {
        entry.timeframe == timeframe;
      }
    );
  };

  public query ({ caller }) func getMarketIntelligenceByTimeframeAndAsset(timeframe : Text, asset : Text) : async [MarketIntelligence] {
    if (not hasFullMarketIntelAccess(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };

    let allMarketIntelligence = marketIntelligenceStore.values().toArray();
    allMarketIntelligence.filter(
      func(entry) {
        entry.timeframe == timeframe and entry.asset == asset;
      }
    );
  };

  public shared ({ caller }) func deleteMarketIntelligence(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete market intelligence records");
    };

    if (not marketIntelligenceStore.containsKey(id)) {
      Runtime.trap("Market intelligence record does not exist");
    };

    marketIntelligenceStore.remove(id);
  };

  public query ({ caller }) func getMarketIntelligenceCount() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view market intelligence statistics");
    };
    marketIntelligenceStore.size();
  };

  public query ({ caller }) func getMarketIntelligenceByAsset(asset : Text) : async [MarketIntelligence] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view market intelligence by asset");
    };

    let allMarketIntelligence = marketIntelligenceStore.values().toArray();
    allMarketIntelligence.filter(
      func(entry) {
        entry.asset == asset;
      }
    );
  };
};
