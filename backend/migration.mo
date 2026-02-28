import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      email : ?Text;
    }>;
    submissions : Map.Map<Nat, {
      id : Nat;
      name : Text;
      country : Text;
      walletAddress : Text;
      rbsAmount : Float;
      isPresale : Bool;
      timestamp : Int;
      submittedBy : Principal;
    }>;
    timers : Map.Map<Text, {
      isUnlocked : Bool;
      endTime : Int;
      lastUpdate : Int;
    }>;
    marketIntelAccess : Map.Map<Principal, Int>;
    marketIntelligenceStore : Map.Map<Nat, {
      id : Nat;
      asset : Text;
      timeframe : Text;
      indicators : [{
        indicatorType : {
          #rsi;
          #macd;
          #bollingerBands;
          #vwap;
          #movingAverage;
          #fvg;
          #orderBlocks;
        };
        value : Float;
        signal : {
          #strongBuy;
          #buy;
          #neutral;
          #sell;
          #strongSell;
        };
      }];
      overallSignal : {
        #strongBuy;
        #buy;
        #neutral;
        #sell;
        #strongSell;
      };
      historicalAccuracy : Float;
      timestamp : Int;
    }>;
    apiKeys : Map.Map<Nat, {
      id : Nat;
      provider : Text;
      key : Text;
      createdAt : Time.Time;
      updatedAt : ?Time.Time;
      active : Bool;
      secretRef : Text;
    }>;
    polls : Map.Map<Nat, {
      id : Nat;
      question : Text;
      options : [Text];
      createdAt : Time.Time;
      creator : Principal;
      code : Text;
      votes : Map.Map<Text, Nat>;
      voterTracking : Map.Map<Principal, Bool>;
      isActive : Bool;
    }>;
    cryptoCurrencies : Map.Map<Text, {
      symbol : Text;
      currentPriceUsd : Float;
      updateIntervalSecs : Nat;
      lastUpdateTimestamp : Int;
    }>;
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
    scheduledTasks : Map.Map<Text, {
      name : Text;
      intervalSeconds : Nat;
      lastRunTimestamp : Int;
    }>;
    alertsStore : Map.Map<Principal, [{
      id : Nat;
      title : Text;
      message : Text;
      timestamp : Int;
      read : Bool;
      autoCreated : Bool;
      triggerEnabled : Bool;
      lastChecked : Int;
    }]>;
    livePriceSnapshots : Map.Map<Nat, {
      priceUsd : Float;
      volume24h : Float;
      marketCap : Float;
      timestamp : Int;
    }>;
    aiSentimentsStore : Map.Map<Nat, {
      id : Nat;
      sentimentScore : Float;
      timestamp : Int;
      sentimentType : {
        #positive;
        #neutral;
        #negative;
      };
    }>;
    currentId : Nat;
    nextMIId : Nat;
    pollIdCounter : Nat;
    lastEconomyUpdate : Int;
    lastAlertId : Nat;
    lastPoll : ?{
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
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    initialized : Bool;
  };

  type NewActor = {
    // Per-principal vote tracking for Market Pulse (replaces global lastVote)
    voteCounts : Map.Map<Principal, {
      #bullish;
      #bearish;
      #neutral;
    }>;
    lastPulseCalculation : ?{
      #bullish;
      #bearish;
      #neutral;
    };
  };

  public func run(old : OldActor) : NewActor {
    {
      voteCounts = Map.empty<Principal, {
        #bullish;
        #bearish;
        #neutral;
      }>();
      lastPulseCalculation = null;
    };
  };
};
