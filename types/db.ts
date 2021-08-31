import { SessionProps } from './index';

export interface StoreData {
    accessToken?: string;
    scope?: string;
    storeHash: string;
}

export interface UserData {
    email: string;
    username?: string;
}

export interface Db {
    hasStoreUser(storeHash: string, userId: string): Promise<boolean> | boolean;
    setUser(session: SessionProps): Promise<void>;
    setStore(session: SessionProps): Promise<void>;
    setStorePlan(session: SessionProps): Promise<void>;
    setStoreUser(session: SessionProps): Promise<void>;
    setStoreWelcome(storeHash: string, show: boolean): Promise<void>;
    setSubscriptionId(pid: string, subscriptionId: string): Promise<void>;
    getStore(): StoreData | null;
    getStorePlan(storeHash: string): Promise<void>;
    getStoreToken(storeHash: string): string | null;
    getSubscriptionId(pid: string): string | null;
    deleteStore(session: SessionProps): Promise<void>;
    deleteUser(session: SessionProps): Promise<void>;
}
