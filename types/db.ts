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
    hasStoreUser(storeHash: string, userId: string): boolean;
    setUser(session: SessionProps): Promise<void>;
    setStore(session: SessionProps): Promise<void>;
    setStoreUser(session: SessionProps): Promise<void>;
    getStore(): StoreData | null;
    getStoreToken(storeId: string): string | null;
    deleteStore(session: SessionProps): Promise<void>;
    deleteUser(session: SessionProps): Promise<void>;
}
