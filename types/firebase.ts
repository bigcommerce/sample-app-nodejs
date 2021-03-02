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
