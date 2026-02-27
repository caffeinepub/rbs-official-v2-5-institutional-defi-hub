import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";
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

  type ContactFormSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  type CallAction = {
    #androidApp;
    #iosApp;
    #webApp;
    #extension;
    #group;
    #broadcast;
  };

  type Alert = {
    id : Nat;
    title : Text;
    message : Text;
    timestamp : Int;
    read : Bool;
    autoCreated : Bool;
    triggerEnabled : Bool;
    lastChecked : Int;
  };

  type LivePriceSnapshot = {
    priceUsd : Float;
    volume24h : Float;
    marketCap : Float;
    timestamp : Int;
  };

  type AISentiment = {
    id : Nat;
    sentimentScore : Float;
    timestamp : Int;
    sentimentType : SentimentType;
  };

  type SentimentType = {
    #positive;
    #neutral;
    #negative;
  };

  type Poll = {
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

  type PollView = {
    id : Nat;
    question : Text;
    options : [Text];
    createdAt : Time.Time;
    creator : Principal;
    code : Text;
    votes : [KeyVal];
    isActive : Bool;
  };

  type CryptoCurrency = {
    symbol : Text;
    currentPriceUsd : Float;
    updateIntervalSecs : Nat;
    lastUpdateTimestamp : Int;
  };

  type KeyVal = {
    key : Text;
    value : Nat;
  };

  type ApiKey = {
    id : Nat;
    provider : Text;
    key : Text;
    createdAt : Time.Time;
    updatedAt : ?Time.Time;
    active : Bool;
    secretRef : Text;
  };

  type MarketAnalysisConfig = {
    endpoints : [Text];
  };

  type VotingOption = {
    text : Text;
    count : Nat;
  };

  type ScheduledTask = {
    name : Text;
    intervalSeconds : Nat;
    lastRunTimestamp : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    submissions : Map.Map<Nat, FormSubmission>;
    timers : Map.Map<Text, TimerState>;
    marketIntelAccess : Map.Map<Principal, Int>;
    marketIntelligenceStore : Map.Map<Nat, MarketIntelligence>;
    apiKeys : Map.Map<Nat, ApiKey>;
    polls : Map.Map<Nat, Poll>;
    cryptoCurrencies : Map.Map<Text, CryptoCurrency>;
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
    scheduledTasks : Map.Map<Text, ScheduledTask>;
    alertsStore : Map.Map<Principal, [Alert]>;
    livePriceSnapshots : Map.Map<Nat, LivePriceSnapshot>;
    aiSentimentsStore : Map.Map<Nat, AISentiment>;
    currentId : Nat;
    nextMIId : Nat;
    pollIdCounter : Nat;
    lastEconomyUpdate : Int;
    lastAlertId : Nat;
    lastPoll : ?Poll;
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    initialized : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    submissions : Map.Map<Nat, FormSubmission>;
    timers : Map.Map<Text, TimerState>;
    marketIntelAccess : Map.Map<Principal, Int>;
    marketIntelligenceStore : Map.Map<Nat, MarketIntelligence>;
    apiKeys : Map.Map<Nat, ApiKey>;
    polls : Map.Map<Nat, Poll>;
    cryptoCurrencies : Map.Map<Text, CryptoCurrency>;
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
    scheduledTasks : Map.Map<Text, ScheduledTask>;
    alertsStore : Map.Map<Principal, [Alert]>;
    livePriceSnapshots : Map.Map<Nat, LivePriceSnapshot>;
    aiSentimentsStore : Map.Map<Nat, AISentiment>;
    currentId : Nat;
    nextMIId : Nat;
    pollIdCounter : Nat;
    lastEconomyUpdate : Int;
    lastAlertId : Nat;
    lastPoll : ?Poll;
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    initialized : Bool;
  };

  public func run(old : OldActor) : NewActor {
    // Presale end: March 31, 2027 23:59:59 UTC in nanoseconds
    let newPresaleEndTime : Int = 1_806_724_799_000_000_000;
    // Airdrop end: March 31, 2029 23:59:59 UTC in nanoseconds
    let newAirdropEndTime : Int = 1_869_796_799_000_000_000;
    { old with presaleEndTime = newPresaleEndTime; airdropEndTime = newAirdropEndTime };
  };
};
