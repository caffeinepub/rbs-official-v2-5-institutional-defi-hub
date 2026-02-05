import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimerState {
    endTime: bigint;
    lastUpdate: bigint;
    isUnlocked: boolean;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FormSubmission {
    id: bigint;
    country: string;
    isPresale: boolean;
    name: string;
    submittedBy: Principal;
    walletAddress: string;
    rbsAmount: number;
    timestamp: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TechnicalIndicator {
    value: number;
    indicatorType: IndicatorType;
    signal: SignalConfidence;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface MarketIntelligence {
    id: bigint;
    historicalAccuracy: number;
    asset: string;
    timeframe: string;
    overallSignal: SignalConfidence;
    indicators: Array<TechnicalIndicator>;
    timestamp: bigint;
}
export interface Alert {
    id: bigint;
    title: string;
    read: boolean;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export enum IndicatorType {
    fvg = "fvg",
    rsi = "rsi",
    macd = "macd",
    vwap = "vwap",
    movingAverage = "movingAverage",
    bollingerBands = "bollingerBands",
    orderBlocks = "orderBlocks"
}
export enum SignalConfidence {
    buy = "buy",
    strongBuy = "strongBuy",
    sell = "sell",
    neutral = "neutral",
    strongSell = "strongSell"
}
export enum TimerType {
    presale = "presale",
    airdrop = "airdrop"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAlert(title: string, message: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkMarketIntelAccess(): Promise<boolean>;
    clearAlerts(): Promise<void>;
    clearAllRecords(): Promise<void>;
    createRecord(recordType: string, content: string): Promise<bigint>;
    deleteAlert(alertId: bigint): Promise<void>;
    deleteMarketIntelligence(id: bigint): Promise<void>;
    deleteRecord(recordType: string, id: bigint): Promise<void>;
    deleteSubmission(id: bigint): Promise<void>;
    deleteTimer(timerType: TimerType): Promise<void>;
    generateMarketIntel(asset: string, timeframe: string, indicators: Array<TechnicalIndicator>, overallSignal: SignalConfidence, historicalAccuracy: number): Promise<bigint>;
    getAirdropRemainingTime(): Promise<bigint>;
    getAlertCount(): Promise<bigint>;
    getAlerts(): Promise<Array<Alert>>;
    getAllMarketIntelligence(): Promise<Array<MarketIntelligence>>;
    getAllSubmissions(): Promise<Array<FormSubmission>>;
    getAllTimers(): Promise<Array<[string, TimerState]>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentId(): Promise<bigint>;
    getFormSubmission(id: bigint): Promise<FormSubmission | null>;
    getMarketIntelligence(id: bigint): Promise<MarketIntelligence | null>;
    getMarketIntelligenceByAsset(asset: string): Promise<Array<MarketIntelligence>>;
    getMarketIntelligenceByTimeframe(timeframe: string): Promise<Array<MarketIntelligence>>;
    getMarketIntelligenceByTimeframeAndAsset(timeframe: string, asset: string): Promise<Array<MarketIntelligence>>;
    getMarketIntelligenceCount(): Promise<bigint>;
    getMySubmissions(): Promise<Array<FormSubmission>>;
    getPresaleRemainingTime(): Promise<bigint>;
    getRecordCounts(): Promise<{
        roadmap: bigint;
        insights: bigint;
        contact: bigint;
        about: bigint;
        faqs: bigint;
        community: bigint;
        ecosystem: bigint;
        security: bigint;
        whitepaper: bigint;
        testimonials: bigint;
        governance: bigint;
    }>;
    getRecords(recordType: string): Promise<Array<string>>;
    getSubmissionsByCountry(country: string): Promise<Array<FormSubmission>>;
    getSubmissionsByType(isPresale: boolean): Promise<Array<FormSubmission>>;
    getSubmissionsCount(): Promise<bigint>;
    getTimerState(timerType: TimerType): Promise<TimerState | null>;
    getTimerStates(): Promise<Array<[string, TimerState]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantMarketIntelAccess(password: string): Promise<boolean>;
    hasAISentimentAccess(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    markAlertAsRead(alertId: bigint): Promise<void>;
    massDeleteAllSubmissions(): Promise<void>;
    massPopulateRecords(recordType: string, contents: Array<string>): Promise<void>;
    revokeMarketIntelAccessWithPassword(password: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitForm(name: string, country: string, walletAddress: string, rbsAmount: number, isPresale: boolean): Promise<bigint>;
    toggleTimer(timerType: TimerType): Promise<TimerState>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateRecord(recordType: string, id: bigint, content: string): Promise<void>;
    updateSubmission(id: bigint, name: string, country: string, walletAddress: string, rbsAmount: number, isPresale: boolean): Promise<void>;
    updateTimer(timerType: TimerType, isUnlocked: boolean, endTime: bigint): Promise<TimerState>;
}
