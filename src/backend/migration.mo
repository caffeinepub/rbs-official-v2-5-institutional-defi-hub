import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

module {
  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  type MarketIntelligence = {
    id : Nat;
    asset : Text;
    timeframe : Text;
    indicators : [TechnicalIndicator];
    overallSignal : SignalConfidence;
    historicalAccuracy : Float;
    timestamp : Int;
  };

  type FormSubmission = {
    id : Nat;
    name : Text;
    country : Text;
    walletAddress : Text;
    rbsAmount : Float;
    isPresale : Bool;
    timestamp : Int;
    submittedBy : Principal;
  };

  type TimerType = {
    #presale;
    #airdrop;
  };

  type TimerState = {
    isUnlocked : Bool;
    endTime : Int;
    lastUpdate : Int;
  };

  type IndicatorType = {
    #rsi;
    #macd;
    #bollingerBands;
    #vwap;
    #movingAverage;
    #fvg;
    #orderBlocks;
  };

  type SignalConfidence = {
    #strongBuy;
    #buy;
    #neutral;
    #sell;
    #strongSell;
  };

  type TechnicalIndicator = {
    indicatorType : IndicatorType;
    value : Float;
    signal : SignalConfidence;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    submissions : Map.Map<Nat, FormSubmission>;
    timers : Map.Map<Text, TimerState>;
    marketIntelAccess : Map.Map<Principal, Int>;
    nextMIId : Nat;
    currentId : Nat;
    lastEconomyUpdate : Int;
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    testimonialsStore : Map.Map<Nat, Text>;
    insightsStore : Map.Map<Nat, Text>;
    faqStore : Map.Map<Nat, Text>;
    governanceStore : Map.Map<Nat, Text>;
    ecosystemStore : Map.Map<Nat, Text>;
    whitepaperStore : Map.Map<Nat, Text>;
    roadmapStore : Map.Map<Nat, Text>;
    aboutStore : Map.Map<Nat, Text>;
    communityStore : Map.Map<Nat, Text>;
    securityStore : Map.Map<Nat, Text>;
    contactStore : Map.Map<Nat, Text>;
    marketIntelligenceStore : Map.Map<Nat, MarketIntelligence>;
    isMarketIntelUnlocked : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    submissions : Map.Map<Nat, FormSubmission>;
    timers : Map.Map<Text, TimerState>;
    marketIntelAccess : Map.Map<Principal, Int>;
    nextMIId : Nat;
    currentId : Nat;
    lastEconomyUpdate : Int;
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    testimonialsStore : Map.Map<Nat, Text>;
    insightsStore : Map.Map<Nat, Text>;
    faqStore : Map.Map<Nat, Text>;
    governanceStore : Map.Map<Nat, Text>;
    ecosystemStore : Map.Map<Nat, Text>;
    whitepaperStore : Map.Map<Nat, Text>;
    roadmapStore : Map.Map<Nat, Text>;
    aboutStore : Map.Map<Nat, Text>;
    communityStore : Map.Map<Nat, Text>;
    securityStore : Map.Map<Nat, Text>;
    contactStore : Map.Map<Nat, Text>;
    marketIntelligenceStore : Map.Map<Nat, MarketIntelligence>;
  };

  public func run(old : OldActor) : NewActor {
    let marketIntelAccess = old.marketIntelAccess;
    let submissions = old.submissions.map<Nat, FormSubmission, FormSubmission>(
      func(_id, submission) {
        submission;
      }
    );
    let timers = old.timers.map<Text, TimerState, TimerState>(
      func(_k, v) { v }
    );
    let testimonialsStore = old.testimonialsStore.map(
      func(_id, t) { t }
    );
    let insightsStore = old.insightsStore.map(
      func(_id, t) { t }
    );
    let faqStore = old.faqStore.map(
      func(_id, t) { t }
    );
    let governanceStore = old.governanceStore.map(
      func(_id, t) { t }
    );
    let ecosystemStore = old.ecosystemStore.map(
      func(_id, t) { t }
    );
    let whitepaperStore = old.whitepaperStore.map(
      func(_id, t) { t }
    );
    let roadmapStore = old.roadmapStore.map(
      func(_id, t) { t }
    );
    let aboutStore = old.aboutStore.map(
      func(_id, t) { t }
    );
    let communityStore = old.communityStore.map(
      func(_id, t) { t }
    );
    let securityStore = old.securityStore.map(
      func(_id, t) { t }
    );
    let contactStore = old.contactStore.map(
      func(_id, t) { t }
    );
    let marketIntelligenceStore = old.marketIntelligenceStore.map<Nat, MarketIntelligence, MarketIntelligence>(
      func(_id, entry) { entry }
    );

    {
      old with
      testimonialsStore;
      insightsStore;
      faqStore;
      governanceStore;
      ecosystemStore;
      whitepaperStore;
      roadmapStore;
      aboutStore;
      communityStore;
      securityStore;
      contactStore;
      marketIntelAccess;
      timers;
      submissions;
      marketIntelligenceStore;
    };
  };
};
