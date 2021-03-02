import { NextApiRequest, NextApiResponse } from 'next';
import * as BigCommerce from 'node-bigcommerce';
import { QueryParams, SessionProps } from '../types';
import { decode, getCookie, removeCookie, setCookie } from './cookie';
import * as fire from './firebase';

const { AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, DB_TYPE } = process.env;

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

export async function setSession(req: NextApiRequest, res: NextApiResponse, session: SessionProps) {
    await setCookie(res, session);

    // Store data to specified db; needed if cookies expired/ unavailable
    if (DB_TYPE === 'firebase') {
        fire.setUser(session);
        fire.setStore(session);
    }
}

export async function getSession(req: NextApiRequest) {
    const cookies = getCookie(req);
    if (cookies) return decode(cookies);

    return await fire.getStore();
}

export async function removeSession(res: NextApiResponse, session: SessionProps) {
    removeCookie(res);

    if (DB_TYPE === 'firebase') await fire.deleteStore(session);
}
