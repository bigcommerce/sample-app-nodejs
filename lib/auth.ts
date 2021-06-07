import { NextApiRequest, NextApiResponse } from 'next';
import * as BigCommerce from 'node-bigcommerce';
import { QueryParams, SessionProps } from '../types';
import { decode, getCookie, removeCookie, setCookie } from './cookie';
import db from './db';

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

export function bigcommerceClient(accessToken: string, storeHash: string) {
    return new BigCommerce({
        clientId: CLIENT_ID,
        accessToken,
        storeHash,
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

    db.setUser(session);
    db.setStore(session);
    db.setStoreUser(session);
}

export async function getSession(req: NextApiRequest) {
    const cookies = getCookie(req);
    if (cookies) {
        const cookieData = decode(cookies);
        const accessToken = await db.getStoreToken(cookieData?.storeHash);

        return { ...cookieData, accessToken };
    }

    throw new Error('Cookies unavailable. Please reload the application.');
}

export async function removeSession(res: NextApiResponse, session: SessionProps) {
    removeCookie(res);

    await db.deleteStore(session);
}

export async function removeUserData(res: NextApiResponse, session: SessionProps) {
    removeCookie(res);

    await db.deleteUser(session);
}
