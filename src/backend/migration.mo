import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    userProfiles : Map.Map<Principal.Principal, { name : Text; email : ?Text }>;
    submissions : Map.Map<Nat, { id : Nat; name : Text; country : Text; walletAddress : Text; rbsAmount : Float; isPresale : Bool; timestamp : Int; submittedBy : Principal.Principal }>;
    timers : Map.Map<Text, { isUnlocked : Bool; endTime : Int; lastUpdate : Int }>;
    marketIntelAccess : Map.Map<Principal.Principal, Int>;
    marketIntelligenceStore : Map.Map<Nat, { id : Nat; asset : Text; timeframe : Text; indicators : [{ indicatorType : { #rsi; #macd; #bollingerBands; #vwap; #movingAverage; #fvg; #orderBlocks }; value : Float; signal : { #strongBuy; #buy; #neutral; #sell; #strongSell } }]; overallSignal : { #strongBuy; #buy; #neutral; #sell; #strongSell }; historicalAccuracy : Float; timestamp : Int }>;
    apiKeys : Map.Map<Nat, { id : Nat; provider : Text; key : Text; createdAt : Int; updatedAt : ?Int; active : Bool; secretRef : Text }>;
    polls : Map.Map<Nat, { id : Nat; question : Text; options : [Text]; createdAt : Int; creator : Principal.Principal; code : Text; votes : Map.Map<Text, Nat>; voterTracking : Map.Map<Principal.Principal, Bool>; isActive : Bool }>;
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
    currentId : Nat;
    nextMIId : Nat;
    pollIdCounter : Nat;
    lastEconomyUpdate : Int;
    lastAlertId : Nat;
    lastPoll : ?{ id : Nat; question : Text; options : [Text]; createdAt : Int; creator : Principal.Principal; code : Text; votes : Map.Map<Text, Nat>; voterTracking : Map.Map<Principal.Principal, Bool>; isActive : Bool };
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    alertsStore : Map.Map<Principal.Principal, [{ id : Nat; title : Text; message : Text; timestamp : Int; read : Bool; autoCreated : Bool; triggerEnabled : Bool; lastChecked : Int }]>;
    livePriceSnapshots : Map.Map<Nat, { priceUsd : Float; volume24h : Float; marketCap : Float; timestamp : Int }>;
    aiSentimentsStore : Map.Map<Nat, { id : Nat; sentimentScore : Float; timestamp : Int; sentimentType : { #positive; #neutral; #negative } }>;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal.Principal, { name : Text; email : ?Text }>;
    submissions : Map.Map<Nat, { id : Nat; name : Text; country : Text; walletAddress : Text; rbsAmount : Float; isPresale : Bool; timestamp : Int; submittedBy : Principal.Principal }>;
    timers : Map.Map<Text, { isUnlocked : Bool; endTime : Int; lastUpdate : Int }>;
    marketIntelAccess : Map.Map<Principal.Principal, Int>;
    marketIntelligenceStore : Map.Map<Nat, { id : Nat; asset : Text; timeframe : Text; indicators : [{ indicatorType : { #rsi; #macd; #bollingerBands; #vwap; #movingAverage; #fvg; #orderBlocks }; value : Float; signal : { #strongBuy; #buy; #neutral; #sell; #strongSell } }]; overallSignal : { #strongBuy; #buy; #neutral; #sell; #strongSell }; historicalAccuracy : Float; timestamp : Int }>;
    apiKeys : Map.Map<Nat, { id : Nat; provider : Text; key : Text; createdAt : Int; updatedAt : ?Int; active : Bool; secretRef : Text }>;
    polls : Map.Map<Nat, { id : Nat; question : Text; options : [Text]; createdAt : Int; creator : Principal.Principal; code : Text; votes : Map.Map<Text, Nat>; voterTracking : Map.Map<Principal.Principal, Bool>; isActive : Bool }>;
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
    currentId : Nat;
    nextMIId : Nat;
    pollIdCounter : Nat;
    lastEconomyUpdate : Int;
    lastAlertId : Nat;
    lastPoll : ?{ id : Nat; question : Text; options : [Text]; createdAt : Int; creator : Principal.Principal; code : Text; votes : Map.Map<Text, Nat>; voterTracking : Map.Map<Principal.Principal, Bool>; isActive : Bool };
    maxSubmissions : Nat;
    marketIntelPassword : Text;
    presaleEndTime : Int;
    airdropEndTime : Int;
    alertsStore : Map.Map<Principal.Principal, [{ id : Nat; title : Text; message : Text; timestamp : Int; read : Bool; autoCreated : Bool; triggerEnabled : Bool; lastChecked : Int }]>;
    livePriceSnapshots : Map.Map<Nat, { priceUsd : Float; volume24h : Float; marketCap : Float; timestamp : Int }>;
    aiSentimentsStore : Map.Map<Nat, { id : Nat; sentimentScore : Float; timestamp : Int; sentimentType : { #positive; #neutral; #negative } }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
