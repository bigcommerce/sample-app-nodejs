import * as BigCommerce from 'node-bigcommerce';
import { QueryParams } from '../types';

const { AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET } = process.env;

// Create BigCommerce instance
// https://github.com/getconversio/node-bigcommerce
const bigcommerce = new BigCommerce({
    logLevel: 'info',
    clientId: CLIENT_ID,
    secret: CLIENT_SECRET,
    callback: AUTH_CALLBACK,
    responseType: 'json',
    headers: { 'Accept-Encoding': '*' },
    apiVersion: 'v3'
});

const bigcommerceSigned = new BigCommerce({
    secret: CLIENT_SECRET,
    responseType: 'json'
});

export function bigcommerceClient(accessToken: string, storeId: string) {
    return new BigCommerce({
        clientId: CLIENT_ID,
        accessToken,
        storeHash: storeId,
        responseType: 'json',
        apiVersion: 'v3'
    });
}

export function getBCAuth(query: QueryParams) {
    return bigcommerce.authorize(query);
}

export function getBCVerify({ signed_payload }: QueryParams) {
    return bigcommerceSigned.verify(signed_payload);
}
