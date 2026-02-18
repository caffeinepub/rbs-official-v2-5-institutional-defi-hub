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
export type Time = bigint;
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
export interface KeyVal {
    key: string;
    value: bigint;
}
export interface CreatePollInput {
    question: string;
    code: string;
    isActive: boolean;
    options: Array<string>;
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
export interface UserProfile {
    name: string;
    email?: string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkAndCreateAutoAlert(): Promise<Alert | null>;
    createAlert(title: string, message: string): Promise<Alert>;
    createPoll(input: CreatePollInput): Promise<bigint>;
    deleteAlert(alertId: bigint): Promise<boolean>;
    enableTrigger(enable: boolean): Promise<void>;
    getAirdropRemainingTime(): Promise<bigint>;
    getAlerts(): Promise<Array<Alert>>;
    getAllPolls(): Promise<Array<PollView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLastPoll(): Promise<PollView | null>;
    getPoll(id: bigint): Promise<PollView | null>;
    getPresaleRemainingTime(): Promise<bigint>;
    getTimerState(timerType: TimerType): Promise<TimerState>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantMarketIntelAccess(password: string): Promise<boolean>;
    hasMarketIntelAccess(): Promise<boolean>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markAlertAsRead(alertId: bigint): Promise<boolean>;
    revokeMarketIntelAccessWithPassword(password: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitVote(pollId: bigint, optionIndex: bigint): Promise<boolean>;
    toggleTimer(timerType: TimerType): Promise<TimerState>;
    updateRecord(recordType: string, id: bigint, content: string): Promise<void>;
    vote(pollId: bigint, option: string): Promise<boolean>;
}
