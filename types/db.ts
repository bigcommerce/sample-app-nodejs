import { SessionProps } from './index';

export interface StoreData {
    accessToken?: string;
    scope?: string;
    storeId: string;
}

export interface UserData {
    email: string;
    storeId: string,
    username?: string;
}

export interface Db {
    setUser(session: SessionProps): Promise<void>;
    setStore(session: SessionProps): Promise<void>;
    getStore(): StoreData | null;
    deleteStore(session: SessionProps): Promise<void>;
}
