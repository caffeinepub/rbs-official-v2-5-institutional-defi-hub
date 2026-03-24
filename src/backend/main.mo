import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";


actor {
  include MixinStorage();

  type InternalPrincipal = Principal;

  // Internal state types/variables
  // HIDDEN BANK PASSWORD - do NOT delete
  // If changed/hardcoded here -> all existing access is invalidated!!
  var hiddenMarketIntelPassword : Text = "BP2420075112009BP";
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    displayName : Text;
    username : Text;
    avatarUrl : ?Text;
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

  public type Signal = {
    #strongBuy;
    #buy;
    #neutral;
    #sell;
    #strongSell;
  };

  public type SignalConfidence = {
    signal : Signal;
    confidence : Nat;
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
    autoCreated : Bool;
    triggerEnabled : Bool;
    lastChecked : Int;
  };

  public type LivePriceSnapshot = {
    priceUsd : Float;
    volume24h : Float;
    marketCap : Float;
    timestamp : Int;
  };

  public type AISentiment = {
    id : Nat;
    sentimentScore : Float;
    timestamp : Int;
    sentimentType : SentimentType;
  };

  public type SentimentType = {
    #positive;
    #neutral;
    #negative;
  };

  public type Poll = {
    id : Nat;
    question : Text;
    options : [Text];
    createdAt : Time.Time;
    creator : Principal;
    code : Text;
    votes : Map.Map<Text, Nat>;
    voterTracking : Map.Map<Principal, Bool>;
    isActive : Bool;
  };

  public type PollView = {
    id : Nat;
    question : Text;
    options : [Text];
    createdAt : Time.Time;
    creator : Principal;
    code : Text;
    votes : [KeyVal];
    isActive : Bool;
  };

  public type CryptoCurrency = {
    symbol : Text;
    currentPriceUsd : Float;
    updateIntervalSecs : Nat;
    lastUpdateTimestamp : Int;
  };

  public type KeyVal = {
    key : Text;
    value : Nat;
  };

  public type ApiKey = {
    id : Nat;
    provider : Text;
    key : Text;
    createdAt : Time.Time;
    updatedAt : ?Time.Time;
    active : Bool;
    secretRef : Text;
  };

  public type MarketAnalysisConfig = {
    endpoints : [Text];
  };

  public type VotingOption = {
    text : Text;
    count : Nat;
  };

  public type ScheduledTask = {
    name : Text;
    intervalSeconds : Nat;
    lastRunTimestamp : Int;
  };

  public type CandlestickData = {
    open : Float;
    high : Float;
    low : Float;
    close : Float;
    timestamp : Int;
  };

  public type MarketPulseVote = {
    #bullish;
    #bearish;
    #neutral;
  };

  public type VoteTally = {
    bullish : Nat;
    bearish : Nat;
    neutral : Nat;
    total : Nat;
    lastVoted : ?MarketPulseVote;
  };

  public type SignalResult = {
    signal : Signal;
    confidencePct : Nat;
    indicatorSummary : Text;
    trendDirection : Text;
    calculatedAt : Int;
  };

  // BlogPost type
  public type BlogPost = {
    id : Nat;
    title : Text;
    category : Text;
    body : Text;
    author : Text;
    tags : [Text];
    createdAt : Int;
    updatedAt : ?Int;
    isPublished : Bool;
  };

  // BlogPost input type (without backend-assigned id)
  public type BlogPostInput = {
    title : Text;
    category : Text;
    body : Text;
    author : Text;
    tags : [Text];
    isPublished : Bool;
  };

  let blogStore = Map.empty<Nat, BlogPost>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userRegistrationDates = Map.empty<Principal, Int>();
  let submissions = Map.empty<Nat, FormSubmission>();
  let timers = Map.empty<Text, TimerState>();
  let marketIntelAccess = Map.empty<Principal, Int>();
  let marketIntelligenceStore = Map.empty<Nat, MarketIntelligence>();
  let apiKeys = Map.empty<Nat, ApiKey>();
  let polls = Map.empty<Nat, Poll>();
  let cryptoCurrencies = Map.empty<Text, CryptoCurrency>();
  let testimonialsStore = Map.empty<Nat, Text>();
  let insightsStore = Map.empty<Nat, Text>();
  let faqStore = Map.empty<Nat, Text>();
  let governanceStore = Map.empty<Nat, Text>();
  let ecosystemStore = Map.empty<Nat, Text>();
  let whitepaperStore = Map.empty<Nat, Text>();
  let roadmapStore = Map.empty<Nat, Text>();
  let aboutStore = Map.empty<Nat, Text>();
  let communityStore = Map.empty<Nat, Text>();
  let securityStore = Map.empty<Nat, Text>();
  let contactStore = Map.empty<Nat, Text>();
  let scheduledTasks = Map.empty<Text, ScheduledTask>();
  let voteCounts = Map.empty<Principal, MarketPulseVote>();
  let alertsStore = Map.empty<Principal, [Alert]>();
  let livePriceSnapshots = Map.empty<Nat, LivePriceSnapshot>();
  let aiSentimentsStore = Map.empty<Nat, AISentiment>();
  let globalSectionLocks = Map.empty<Text, Bool>();

  var currentId = 0;
  var nextMIId = 1;
  var pollIdCounter = 0;
  var blogIdCounter = 0;
  var lastEconomyUpdate : Int = 0;
  var lastAlertId = 0;
  var lastPulseCalculation : ?MarketPulseVote = null;
  var lastPoll : ?Poll = null;
  let maxSubmissions = 5000;
  // Presale end: March 31, 2027 23:59:59 UTC in nanoseconds
  var presaleEndTime : Int = 1_806_724_799_000_000_000;
  // Airdrop end: March 31, 2029 23:59:59 UTC in nanoseconds
  var airdropEndTime : Int = 1_869_796_799_000_000_000;
  var initialized = false;
  var bullishVotes = 0;
  var bearishVotes = 0;
  var neutralVotes = 0;

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };
    if (initialized) { Runtime.trap("Already initialized") };
    timers.add("presale", {
      isUnlocked = false;
      endTime = presaleEndTime;
      lastUpdate = Time.now();
    });
    timers.add("airdrop", {
      isUnlocked = false;
      endTime = airdropEndTime;
      lastUpdate = Time.now();
    });
    let btc : CryptoCurrency = {
      symbol = "BTC";
      currentPriceUsd = 0.0;
      updateIntervalSecs = 60;
      lastUpdateTimestamp = 0;
    };
    let eth : CryptoCurrency = {
      symbol = "ETH";
      currentPriceUsd = 0.0;
      updateIntervalSecs = 60;
      lastUpdateTimestamp = 0;
    };
    let bnb : CryptoCurrency = {
      symbol = "BNB";
      currentPriceUsd = 0.0;
      updateIntervalSecs = 120;
      lastUpdateTimestamp = 0;
    };
    cryptoCurrencies.add(btc.symbol, btc);
    cryptoCurrencies.add(eth.symbol, eth);
    cryptoCurrencies.add(bnb.symbol, bnb);
    let priceTask : ScheduledTask = {
      name = "refresh_crypto_prices";
      intervalSeconds = 60;
      lastRunTimestamp = 0;
    };
    let cleanupTask : ScheduledTask = {
      name = "cleanup_stale_entries";
      intervalSeconds = 86400;
      lastRunTimestamp = 0;
    };
    scheduledTasks.add(priceTask.name, priceTask);
    scheduledTasks.add(cleanupTask.name, cleanupTask);
    globalSectionLocks.add("marketIntel", false);
    globalSectionLocks.add("developerBlog", false);
    globalSectionLocks.add("polls", false);
    initialized := true;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (profile.username == "" or profile.displayName == "") {
      Runtime.trap("Display name and username required");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let existingProfile = userProfiles.get(caller);
    var profileWithUsername : UserProfile = profile;

    switch (existingProfile) {
      case (?oldProfile) {
        // Allow username change but enforce uniqueness against other users
        if (oldProfile.username != profile.username) {
          switch (getProfileByUsername(profile.username)) {
            case (null) {};
            case (?_) { Runtime.trap("This username is already taken") };
          };
        };
        profileWithUsername := profile;
      };
      case (null) {
        // Verify new username is not already taken
        switch (getProfileByUsername(profile.username)) {
          case (null) {};
          case (?_) { Runtime.trap("This username is already taken") };
        };
        profileWithUsername := profile;
        // Set registration timestamp if not present
        if (not userRegistrationDates.containsKey(caller)) {
          userRegistrationDates.add(caller, Int.abs(Time.now()));
        };
      };
    };
    userProfiles.add(caller, profileWithUsername);
  };

  func getProfileByUsername(username : Text) : ?UserProfile {
    userProfiles.values().toArray().find(func(profile) { profile.username == username });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    userProfiles.get(user);
  };

  public query func isUsernameTaken(username : Text) : async Bool {
    switch (getProfileByUsername(username)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public type UserProfileEntry = {
    principal : Principal;
    profile : UserProfile;
    registeredAt : ?Int;
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfileEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view all profiles");
    };
    userProfiles.toArray().map(func((k, v)) {
      { principal = k; profile = v; registeredAt = userRegistrationDates.get(k) };
    });
  };

  public query ({ caller }) func getUserRegistrationDate(user : Principal) : async ?Int {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own registration date unless admin");
    };
    userRegistrationDates.get(user);
  };

  public query ({ caller }) func getCallerRegistrationDate() : async ?Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view registration date");
    };
    userRegistrationDates.get(caller);
  };

  public query ({ caller }) func hasMarketIntelAccess() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check Market Intel access");
    };
    marketIntelAccess.containsKey(caller);
  };

  public query ({ caller = _ }) func hasMarketIntelAccessCheck(principal : Principal) : async Bool {
    marketIntelAccess.containsKey(principal);
  };

  public shared ({ caller }) func grantMarketIntelAccess(password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request Market Intel access");
    };
    if (password != hiddenMarketIntelPassword) {
      Runtime.trap("Unauthorized: Invalid Market Intel passcode");
    };
    marketIntelAccess.add(caller, Int.abs(Time.now()));
    true;
  };

  public shared ({ caller }) func adminGrantMarketIntelAccess(principal : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant Market Intel access");
    };
    marketIntelAccess.add(principal, Int.abs(Time.now()));
    true;
  };

  public shared ({ caller }) func revokeMarketIntelAccessWithPassword(password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can revoke Market Intel access");
    };
    if (password != hiddenMarketIntelPassword) {
      Runtime.trap("Unauthorized: Invalid Market Intel passcode");
    };
    switch (marketIntelAccess.get(caller)) {
      case (?_) {
        marketIntelAccess.remove(caller);
        true;
      };
      case (null) { false };
    };
  };

  public query func getPresaleRemainingTime() : async Int {
    let now = Time.now();
    if (presaleEndTime < now) { 0 } else { presaleEndTime - now };
  };

  public query func getAirdropRemainingTime() : async Int {
    let now = Time.now();
    if (airdropEndTime < now) { 0 } else { airdropEndTime - now };
  };

  public query func getPresaleTimerEnd() : async Int {
    presaleEndTime;
  };

  public query func getAirdropTimerEnd() : async Int {
    airdropEndTime;
  };

  public query ({ caller }) func getTimerState(timerType : TimerType) : async TimerState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view timer state");
    };
    let key = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };
    switch (timers.get(key)) {
      case (?state) { state };
      case (null) {
        {
          isUnlocked = false;
          endTime = switch (timerType) {
            case (#presale) { presaleEndTime };
            case (#airdrop) { airdropEndTime };
          };
          lastUpdate = Int.abs(Time.now());
        };
      };
    };
  };

  public shared ({ caller }) func toggleTimer(timerType : TimerType) : async TimerState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle timers");
    };
    let key = switch (timerType) {
      case (#presale) { "presale" };
      case (#airdrop) { "airdrop" };
    };
    let currentState = switch (timers.get(key)) {
      case (?state) { state };
      case (null) {
        {
          isUnlocked = false;
          endTime = switch (timerType) {
            case (#presale) { presaleEndTime };
            case (#airdrop) { airdropEndTime };
          };
          lastUpdate = Int.abs(Time.now());
        };
      };
    };
    let newState = {
      isUnlocked = not currentState.isUnlocked;
      endTime = currentState.endTime;
      lastUpdate = Int.abs(Time.now());
    };
    timers.add(key, newState);
    newState;
  };

  public shared ({ caller }) func setTimerEnd(timerType : TimerType, endTime : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update timer end times");
    };
    switch (timerType) {
      case (#presale) {
        presaleEndTime := endTime;
        switch (timers.get("presale")) {
          case (?state) {
            timers.add("presale", { state with endTime = endTime; lastUpdate = Int.abs(Time.now()) });
          };
          case (null) { };
        };
      };
      case (#airdrop) {
        airdropEndTime := endTime;
        switch (timers.get("airdrop")) {
          case (?state) {
            timers.add("airdrop", { state with endTime = endTime; lastUpdate = Int.abs(Time.now()) });
          };
          case (null) { };
        };
      };
    };
  };

  public shared ({ caller }) func submitPresaleForm(name : Text, country : Text, walletAddress : Text, rbsAmount : Float) : async FormSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit presale forms");
    };
    let presaleTimer = switch (timers.get("presale")) {
      case (?state) { state };
      case (null) {
        Runtime.trap("Presale timer not initialized");
      };
    };
    if (not presaleTimer.isUnlocked) {
      Runtime.trap("Unauthorized: Presale form is locked until roadmap milestone is reached");
    };
    if (submissions.size() >= maxSubmissions) { Runtime.trap("Maximum submissions reached") };
    let id = currentId + 1;
    currentId := id;
    let submission : FormSubmission = {
      id;
      name;
      country;
      walletAddress;
      rbsAmount;
      isPresale = true;
      timestamp = Int.abs(Time.now());
      submittedBy = caller;
    };
    submissions.add(id, submission);
    submission;
  };

  public shared ({ caller }) func submitAirdropForm(name : Text, country : Text, walletAddress : Text, rbsAmount : Float) : async FormSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit airdrop forms");
    };
    let airdropTimer = switch (timers.get("airdrop")) {
      case (?state) { state };
      case (null) {
        Runtime.trap("Airdrop timer not initialized");
      };
    };
    if (not airdropTimer.isUnlocked) {
      Runtime.trap("Unauthorized: Airdrop form is locked until roadmap milestone is reached");
    };
    if (submissions.size() >= maxSubmissions) { Runtime.trap("Maximum submissions reached") };
    let id = currentId + 1;
    currentId := id;
    let submission : FormSubmission = {
      id;
      name;
      country;
      walletAddress;
      rbsAmount;
      isPresale = false;
      timestamp = Int.abs(Time.now());
      submittedBy = caller;
    };
    submissions.add(id, submission);
    submission;
  };

  public query ({ caller }) func getMySubmissions() : async [FormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their submissions");
    };
    let allSubmissions = submissions.values().toArray();
    allSubmissions.filter(func(sub) { sub.submittedBy == caller });
  };

  public query ({ caller }) func getAllSubmissions() : async [FormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };
    submissions.values().toArray();
  };

  public shared ({ caller }) func updateRecord(recordType : Text, id : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update records");
    };
    switch (recordType) {
      case ("testimonial") { testimonialsStore.add(id, content) };
      case ("insight") { insightsStore.add(id, content) };
      case ("faq") { faqStore.add(id, content) };
      case ("governance") { governanceStore.add(id, content) };
      case ("ecosystem") { ecosystemStore.add(id, content) };
      case ("whitepaper") { whitepaperStore.add(id, content) };
      case ("roadmap") { roadmapStore.add(id, content) };
      case ("about") { aboutStore.add(id, content) };
      case ("community") { communityStore.add(id, content) };
      case ("security") { securityStore.add(id, content) };
      case ("contact") { contactStore.add(id, content) };
      case (_) { Runtime.trap("Unknown record type: " # recordType) };
    };
  };

  public shared ({ caller }) func storeMarketIntelligence(asset : Text, timeframe : Text, indicators : [TechnicalIndicator], overallSignal : SignalConfidence, historicalAccuracy : Float) : async MarketIntelligence {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can store market intelligence data");
    };
    let id = nextMIId;
    nextMIId += 1;
    let mi : MarketIntelligence = {
      id;
      asset;
      timeframe;
      indicators;
      overallSignal;
      historicalAccuracy;
      timestamp = Int.abs(Time.now());
    };
    marketIntelligenceStore.add(id, mi);
    mi;
  };

  public query ({ caller }) func getMarketIntelligence(id : Nat) : async ?MarketIntelligence {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view market intelligence");
    };
    if (not marketIntelAccess.containsKey(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };
    marketIntelligenceStore.get(id);
  };

  public query ({ caller }) func getAllMarketIntelligence() : async [MarketIntelligence] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view market intelligence");
    };
    if (not marketIntelAccess.containsKey(caller)) {
      Runtime.trap("Unauthorized: Market Intel access required");
    };
    marketIntelligenceStore.values().toArray();
  };

  // Admin-only: retrieve the current Market Intel passcode
  // HIDDEN BANK PASSWORD - do NOT delete
  public query ({ caller }) func getMarketIntelPasscode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve the Market Intel passcode");
    };
    hiddenMarketIntelPassword;
  };

  // Admin-only: update the Market Intel passcode
  // HIDDEN BANK PASSWORD - do NOT delete
  public shared ({ caller }) func setMarketIntelPasscode(newPasscode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the Market Intel passcode");
    };
    if (newPasscode == "") {
      Runtime.trap("Passcode must not be empty");
    };
    hiddenMarketIntelPassword := newPasscode;
  };

  // Public: verify the Market Intel passcode (does not require authentication)
  // HIDDEN BANK PASSWORD - do NOT delete
  public query ({ caller = _ }) func verifyMarketIntelPasscode(passcode : Text) : async Bool {
    passcode == hiddenMarketIntelPassword;
  };

  // --- GLOBAL SECTION LOCKS ---

  // Returns the current global lock state for a section.
  // Sections: "marketIntel", "developerBlog", "polls"
  // If not found, defaults to false (locked).
  public query ({ caller = _ }) func getGlobalSectionLock(section : Text) : async Bool {
    switch (globalSectionLocks.get(section)) {
      case (?isUnlocked) { isUnlocked };
      case (null) { false };
    };
  };

  // Sets the global lock/unlock state for a section.
  // Authenticated user required. Requires Market Intel passcode verification.
  public shared ({ caller }) func setGlobalSectionLock(section : Text, passcode : Text, unlock : Bool) : async () {
    // Require authenticated user, not just admin
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can modify section locks");
    };
    // Passcode verification required for ALL users (admin _AND_ normal)
    if (passcode != hiddenMarketIntelPassword) {
      Runtime.trap("Unauthorized: Valid Market Intel passcode required to modify section locks");
    };
    // Validate section name before updating
    if (section != "marketIntel" and section != "developerBlog" and section != "polls") {
      Runtime.trap("Invalid section name - use marketIntel, developerBlog, or polls");
    };
    // Store new state (overwrite existing value if set previously)
    globalSectionLocks.add(section, unlock);
  };

  // Toggle (invert) the global lock/unlock state for a section.
  // Authenticated user required. Requires Market Intel passcode verification.
  // Returns the new state (true = unlocked, false = locked).
  public shared ({ caller }) func toggleGlobalSectionLock(section : Text, passcode : Text) : async Bool {
    // Require authenticated user, not just admin
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can toggle section locks");
    };
    // Passcode verification required for ALL users (admin _AND_ normal)
    if (passcode != hiddenMarketIntelPassword) {
      Runtime.trap("Unauthorized: Valid Market Intel passcode required to toggle section locks");
    };
    // Validate section name before updating
    if (section != "marketIntel" and section != "developerBlog" and section != "polls") {
      Runtime.trap("Invalid section name - use marketIntel, developerBlog, or polls");
    };
    // Flip existing value (locked/unlocked), default to false if not found
    let currentState = switch (globalSectionLocks.get(section)) {
      case (?isUnlocked) { isUnlocked };
      case (null) { false };
    };
    let newState = not currentState;
    globalSectionLocks.add(section, newState);
    newState;
  };

  public type CreatePollInput = {
    question : Text;
    options : [Text];
    isActive : Bool;
    code : Text;
  };

  public shared ({ caller }) func createPoll(input : CreatePollInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create polls");
    };
    if (input.code != hiddenMarketIntelPassword) {
      Runtime.trap("Unauthorized: Invalid Market Intel passcode for poll creation");
    };
    let newPoll : Poll = {
      id = pollIdCounter;
      question = input.question;
      options = input.options;
      createdAt = Time.now();
      creator = caller;
      code = input.code;
      votes = Map.empty<Text, Nat>();
      voterTracking = Map.empty<Principal, Bool>();
      isActive = input.isActive;
    };
    polls.add(pollIdCounter, newPoll);
    lastPoll := ?newPoll;
    pollIdCounter += 1;
    pollIdCounter - 1;
  };

  public query ({ caller }) func getAllPolls() : async [PollView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get polls list");
    };
    if (polls.isEmpty()) { return [] };
    let valuesIter = polls.values();
    let resultsArray = valuesIter.toArray();
    resultsArray.map(convertPollToView);
  };

  public query ({ caller }) func getPoll(id : Nat) : async ?PollView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get a poll");
    };
    switch (polls.get(id)) {
      case (?poll) { ?convertPollToView(poll) };
      case (null) { null };
    };
  };

  public query ({ caller }) func getPollsByCode(code : Text) : async [PollView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get polls by code");
    };
    let allPolls = polls.values().toArray();
    allPolls.filter(func(p) { p.code == code }).map(convertPollToView);
  };

  public shared ({ caller }) func vote(pollId : Nat, option : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can vote on polls");
    };
    switch (polls.get(pollId)) {
      case (?poll) {
        switch (poll.voterTracking.get(caller)) {
          case (?true) {
            Runtime.trap("Unauthorized: You have already voted on this poll");
          };
          case (_) {
            let votesMap = poll.votes;
            let currentVotes = switch (votesMap.get(option)) {
              case (?votes) { votes };
              case (null) { 0 };
            };
            votesMap.add(option, currentVotes + 1);
            poll.voterTracking.add(caller, true);
            polls.add(pollId, poll);
            true;
          };
        };
      };
      case (null) { Runtime.trap("Poll not found") };
    };
  };

  public shared ({ caller }) func submitVote(pollId : Nat, optionIndex : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can submit votes");
    };
    switch (polls.get(pollId)) {
      case (?poll) {
        switch (poll.voterTracking.get(caller)) {
          case (?true) {
            Runtime.trap("Unauthorized: You have already voted on this poll");
          };
          case (_) {
            if (optionIndex >= poll.options.size()) {
              Runtime.trap("Invalid option index");
            };
            let optionText = poll.options[optionIndex];
            let votesMap = poll.votes;
            let currentVotes = switch (votesMap.get(optionText)) {
              case (?v) { v };
              case (null) { 0 };
            };
            votesMap.add(optionText, currentVotes + 1);
            poll.voterTracking.add(caller, true);
            polls.add(pollId, poll);
            true;
          };
        };
      };
      case (null) { Runtime.trap("Poll not found") };
    };
  };

  public shared ({ caller }) func deletePoll(pollId : Nat) : async { #ok : (); #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can delete polls");
    };
    switch (polls.get(pollId)) {
      case (?poll) {
        if (poll.creator == caller) {
          polls.remove(pollId);
          return #ok(());
        };
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          return #err("Unauthorized: Only admins or the poll creator can delete this poll");
        };
        polls.remove(pollId);
        #ok(());
      };
      case (null) {
        return #err("POLL_ID_NOT_FOUND");
      };
    };
  };

  func convertPollToView(poll : Poll) : PollView {
    {
      id = poll.id;
      question = poll.question;
      options = poll.options;
      createdAt = poll.createdAt;
      creator = poll.creator;
      code = poll.code;
      votes = poll.votes.toArray().map(func((k, v)) { { key = k; value = v } });
      isActive = poll.isActive;
    };
  };

  public shared ({ caller }) func createAlert(title : Text, message : Text) : async Alert {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create alerts");
    };
    let id = lastAlertId + 1;
    lastAlertId := id;
    let newAlert : Alert = {
      id;
      title;
      message;
      timestamp = Int.abs(Time.now());
      read = false;
      autoCreated = false;
      triggerEnabled = false;
      lastChecked = Int.abs(Time.now());
    };
    let existingAlerts = switch (alertsStore.get(caller)) {
      case (?alerts) { alerts };
      case (null) { [] };
    };
    alertsStore.add(caller, existingAlerts.concat([newAlert]));
    newAlert;
  };

  public query ({ caller }) func getAlerts() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    switch (alertsStore.get(caller)) {
      case (?alerts) { alerts };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func markAlertAsRead(alertId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark alerts as read");
    };
    switch (alertsStore.get(caller)) {
      case (?alerts) {
        let updatedAlerts = alerts.map(func(alert) {
          if (alert.id == alertId) { { alert with read = true } } else { alert };
        });
        alertsStore.add(caller, updatedAlerts);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteAlert(alertId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete alerts");
    };
    switch (alertsStore.get(caller)) {
      case (?alerts) {
        let updatedAlerts = alerts.filter(func(alert) { alert.id != alertId });
        alertsStore.add(caller, updatedAlerts);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func toggleAlertTrigger(alertId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle alert triggers");
    };
    switch (alertsStore.get(caller)) {
      case (?alerts) {
        var found = false;
        let updatedAlerts = alerts.map(func(alert) {
          if (alert.id == alertId) {
            found := true;
            { alert with triggerEnabled = not alert.triggerEnabled };
          } else { alert };
        });
        if (not found) { Runtime.trap("Alert not found") };
        alertsStore.add(caller, updatedAlerts);
        true;
      };
      case (null) { Runtime.trap("No alerts found for caller") };
    };
  };

  public shared ({ caller }) func enableTrigger(enable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enable/disable triggers");
    };
    let existingAlerts = switch (alertsStore.get(caller)) {
      case (?alerts) { alerts };
      case (null) { [] };
    };
    let updatedAlerts = existingAlerts.map(func(alert) {
      { alert with triggerEnabled = enable };
    });
    alertsStore.add(caller, updatedAlerts);
  };

  public shared ({ caller }) func checkAndCreateAutoAlert() : async ?Alert {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check and create auto alerts");
    };
    switch (alertsStore.get(caller)) {
      case (?alerts) {
        let enabledAlerts = alerts.filter(func(alert) { alert.triggerEnabled });
        if (enabledAlerts.size() == 0) { return null };
        let autoAlert : Alert = {
          id = lastAlertId + 1;
          title = "Auto Alert";
          message = "This is a system-generated alert";
          timestamp = Int.abs(Time.now());
          read = false;
          autoCreated = true;
          triggerEnabled = true;
          lastChecked = Int.abs(Time.now());
        };
        alertsStore.add(caller, alerts.concat([autoAlert]));
        lastAlertId += 1;
        ?autoAlert;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateCryptoCurrency(symbol : Text, priceUsd : Float, updateIntervalSecs : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update crypto currencies");
    };
    let now = Int.abs(Time.now());
    let newCurrency : CryptoCurrency = {
      symbol;
      currentPriceUsd = priceUsd;
      updateIntervalSecs;
      lastUpdateTimestamp = now;
    };
    cryptoCurrencies.add(symbol, newCurrency);
  };

  public query func getCryptoCurrency(symbol : Text) : async ?CryptoCurrency {
    cryptoCurrencies.get(symbol);
  };

  public query func getAllCryptoCurrencies() : async [CryptoCurrency] {
    cryptoCurrencies.values().toArray();
  };

  public query ({ caller = _ }) func getScheduledTasks() : async [ScheduledTask] {
    scheduledTasks.values().toArray();
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getBTCPriceFromCoingecko() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can trigger HTTP outcalls");
    };
    await OutCall.httpGetRequest(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      [],
      transform,
    );
  };

  public shared ({ caller }) func voteMarketPulse(sentiment : Text) : async VoteTally {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can vote for Market Pulse");
    };

    let newVote : MarketPulseVote = switch (sentiment) {
      case ("bullish") { #bullish };
      case ("bearish") { #bearish };
      case ("neutral") { #neutral };
      case (_) { Runtime.trap("Invalid sentiment: must be bullish, bearish, or neutral") };
    };

    switch (voteCounts.get(caller)) {
      case (?previousVote) {
        if (previousVote == newVote) {
          Runtime.trap("You have already voted with this sentiment");
        };
        switch (previousVote) {
          case (#bullish) { bullishVotes -= 1 };
          case (#bearish) { bearishVotes -= 1 };
          case (#neutral) { neutralVotes -= 1 };
        };
      };
      case (null) {};
    };

    voteCounts.add(caller, newVote);

    switch (newVote) {
      case (#bullish) { bullishVotes += 1 };
      case (#bearish) { bearishVotes += 1 };
      case (#neutral) { neutralVotes += 1 };
    };

    let total = bullishVotes + bearishVotes + neutralVotes;

    {
      bullish = bullishVotes;
      bearish = bearishVotes;
      neutral = neutralVotes;
      total;
      lastVoted = ?newVote;
    };
  };

  public query ({ caller }) func getMarketPulseTally() : async VoteTally {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view market pulse tally");
    };
    let total = bullishVotes + bearishVotes + neutralVotes;
    {
      bullish = bullishVotes;
      bearish = bearishVotes;
      neutral = neutralVotes;
      total;
      lastVoted = null;
    };
  };

  public shared ({ caller }) func publishBlogPost(post : BlogPost, passcode : Text) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can publish blog posts");
    };
    if (passcode != hiddenMarketIntelPassword) {
      return #err("Unauthorized: Valid Market Intel passcode required to publish blog posts");
    };
    blogIdCounter += 1;
    let newId = blogIdCounter;
    let newPost : BlogPost = {
      id = newId;
      title = post.title;
      category = post.category;
      body = post.body;
      author = post.author;
      tags = post.tags;
      createdAt = Int.abs(Time.now());
      updatedAt = null;
      isPublished = true;
    };
    blogStore.add(newId, newPost);
    #ok("BLOG_PUBLISHED");
  };

  public shared ({ caller }) func createBlogPost(post : BlogPost, passcode : Text) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can create blog posts");
    };
    if (passcode != hiddenMarketIntelPassword) {
      return #err("Unauthorized: Valid Market Intel passcode required to create blog posts");
    };
    blogIdCounter += 1;
    let newId = blogIdCounter;
    let newPost : BlogPost = {
      id = newId;
      title = post.title;
      category = post.category;
      body = post.body;
      author = post.author;
      tags = post.tags;
      createdAt = Int.abs(Time.now());
      updatedAt = null;
      isPublished = true;
    };
    blogStore.add(newId, newPost);
    #ok("BLOG_CREATED");
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view blog posts");
    };
    let allPosts = blogStore.values().toArray();
    allPosts.filter(func(p) { p.isPublished });
  };

  public query ({ caller }) func getPublishedPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view blog posts");
    };
    let allPosts = blogStore.values().toArray();
    allPosts.filter(func(p) { p.isPublished });
  };

  public query ({ caller }) func getBlogPostById(id : Nat) : async ?BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view blog posts");
    };
    switch (blogStore.get(id)) {
      case (?post) {
        if (post.isPublished) { ?post } else { null };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllBlogPostsAdmin() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all blog posts including unpublished");
    };
    blogStore.values().toArray();
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat, authorCode : Text) : async { #ok : (); #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can delete blog posts");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) {
      if (authorCode != hiddenMarketIntelPassword) {
        return #err("Unauthorized: Valid Market Intel passcode required to delete blog posts");
      };
    };
    switch (blogStore.get(id)) {
      case (?_) {
        blogStore.remove(id);
        #ok(());
      };
      case (null) {
        #err("BLOG_POST_NOT_FOUND");
      };
    };
  };

  public shared ({ caller }) func deletePollWithPasscode(pollId : Nat, passcode : Text) : async { #ok : (); #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can delete polls");
    };
    if (passcode != hiddenMarketIntelPassword) {
      return #err("Invalid passcode");
    };
    switch (polls.get(pollId)) {
      case (null) { return #err("Poll not found") };
      case (?_) {};
    };
    polls.remove(pollId);
    #ok(());
  };
};

