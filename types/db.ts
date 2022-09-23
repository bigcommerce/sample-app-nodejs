import { DocumentData } from 'firebase/firestore';

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
    setStoreUser(session: SessionProps): Promise<void>;
    getStoreToken(storeHash: string): Promise<string> | null;
    deleteStore(session: SessionProps): Promise<void>;
    deleteUser(session: SessionProps): Promise<void>;
    setStorePlan?(session: SessionProps): Promise<void>;
    setStoreWelcome?(storeHash: string, show: boolean): Promise<void>;
    setCheckoutId?(pid: string, subscriptionId: string): Promise<void>;
    getStorePlan?(storeHash: string): Promise<DocumentData>;
    getCheckoutId?(pid: string): Promise<void> | null;
}
