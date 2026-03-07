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
export type Time = bigint;
export interface CryptoCurrency {
    lastUpdateTimestamp: bigint;
    currentPriceUsd: number;
    symbol: string;
    updateIntervalSecs: bigint;
}
export interface VoteTally {
    total: bigint;
    bullish: bigint;
    bearish: bigint;
    lastVoted?: MarketPulseVote;
    neutral: bigint;
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
export interface BlogPost {
    id: bigint;
    title: string;
    isPublished: boolean;
    body: string;
    createdAt: bigint;
    tags: Array<string>;
    author: string;
    updatedAt?: bigint;
    category: string;
}
export interface Alert {
    id: bigint;
    title: string;
    read: boolean;
    triggerEnabled: boolean;
    message: string;
    timestamp: bigint;
    lastChecked: bigint;
    autoCreated: boolean;
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
export interface SignalConfidence {
    signal: Signal;
    confidence: bigint;
}
export interface PollView {
    id: bigint;
    creator: Principal;
    question: string;
    votes: Array<KeyVal>;
    code: string;
    createdAt: Time;
    isActive: boolean;
    options: Array<string>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface KeyVal {
    key: string;
    value: bigint;
}
export interface ScheduledTask {
    name: string;
    lastRunTimestamp: bigint;
    intervalSeconds: bigint;
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
export interface CreatePollInput {
    question: string;
    code: string;
    isActive: boolean;
    options: Array<string>;
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
export enum MarketPulseVote {
    bullish = "bullish",
    bearish = "bearish",
    neutral = "neutral"
}
export enum Signal {
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
    adminGrantMarketIntelAccess(principal: Principal): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkAndCreateAutoAlert(): Promise<Alert | null>;
    createAlert(title: string, message: string): Promise<Alert>;
    createBlogPost(post: BlogPost, passcode: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createPoll(input: CreatePollInput): Promise<bigint>;
    deleteAlert(alertId: bigint): Promise<boolean>;
    deleteBlogPost(id: bigint, authorCode: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deletePoll(pollId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enableTrigger(enable: boolean): Promise<void>;
    getAirdropRemainingTime(): Promise<bigint>;
    getAirdropTimerEnd(): Promise<bigint>;
    getAlerts(): Promise<Array<Alert>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllBlogPostsAdmin(): Promise<Array<BlogPost>>;
    getAllCryptoCurrencies(): Promise<Array<CryptoCurrency>>;
    getAllMarketIntelligence(): Promise<Array<MarketIntelligence>>;
    getAllPolls(): Promise<Array<PollView>>;
    getAllSubmissions(): Promise<Array<FormSubmission>>;
    getBTCPriceFromCoingecko(): Promise<string>;
    getBlogPostById(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCryptoCurrency(symbol: string): Promise<CryptoCurrency | null>;
    getGlobalSectionLock(section: string): Promise<boolean>;
    getMarketIntelPasscode(): Promise<string>;
    getMarketIntelligence(id: bigint): Promise<MarketIntelligence | null>;
    getMarketPulseTally(): Promise<VoteTally>;
    getMySubmissions(): Promise<Array<FormSubmission>>;
    getPoll(id: bigint): Promise<PollView | null>;
    getPollsByCode(code: string): Promise<Array<PollView>>;
    getPresaleRemainingTime(): Promise<bigint>;
    getPresaleTimerEnd(): Promise<bigint>;
    getPublishedPosts(): Promise<Array<BlogPost>>;
    getScheduledTasks(): Promise<Array<ScheduledTask>>;
    getTimerState(timerType: TimerType): Promise<TimerState>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantMarketIntelAccess(password: string): Promise<boolean>;
    hasMarketIntelAccess(): Promise<boolean>;
    hasMarketIntelAccessCheck(principal: Principal): Promise<boolean>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markAlertAsRead(alertId: bigint): Promise<boolean>;
    publishBlogPost(post: BlogPost, passcode: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    revokeMarketIntelAccessWithPassword(password: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setGlobalSectionLock(section: string, passcode: string, unlock: boolean): Promise<void>;
    setMarketIntelPasscode(newPasscode: string): Promise<void>;
    setTimerEnd(timerType: TimerType, endTime: bigint): Promise<void>;
    storeMarketIntelligence(asset: string, timeframe: string, indicators: Array<TechnicalIndicator>, overallSignal: SignalConfidence, historicalAccuracy: number): Promise<MarketIntelligence>;
    submitAirdropForm(name: string, country: string, walletAddress: string, rbsAmount: number): Promise<FormSubmission>;
    submitPresaleForm(name: string, country: string, walletAddress: string, rbsAmount: number): Promise<FormSubmission>;
    submitVote(pollId: bigint, optionIndex: bigint): Promise<boolean>;
    toggleAlertTrigger(alertId: bigint): Promise<boolean>;
    toggleGlobalSectionLock(section: string, passcode: string): Promise<boolean>;
    toggleTimer(timerType: TimerType): Promise<TimerState>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCryptoCurrency(symbol: string, priceUsd: number, updateIntervalSecs: bigint): Promise<void>;
    updateRecord(recordType: string, id: bigint, content: string): Promise<void>;
    verifyMarketIntelPasscode(passcode: string): Promise<boolean>;
    vote(pollId: bigint, option: string): Promise<boolean>;
    voteMarketPulse(sentiment: string): Promise<VoteTally>;
}
