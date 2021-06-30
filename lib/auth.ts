import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import * as BigCommerce from 'node-bigcommerce';
import { QueryParams, SessionProps } from '../types';
import db from './db';

const { AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, JWT_KEY } = process.env;

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

export function setSession(session: SessionProps) {
    db.setUser(session);
    db.setStore(session);
    db.setStoreUser(session);
}

export async function getSession({ query: { context = '' } }: NextApiRequest) {
    if (typeof context !== 'string') return;
    const { context: storeHash, user } = decodePayload(context);
    const hasUser = await db.hasStoreUser(storeHash, user?.id);
    const accessToken = await db.getStoreToken(storeHash);

    // Before retrieving session/ hitting APIs, check user
    if (!hasUser) {
        throw new Error('User is not available. Please login or ensure you have access permissions.');
    }

    return { accessToken, storeHash };
}

export async function removeSession(res: NextApiResponse, session: SessionProps) {
    await db.deleteStore(session);
}

export async function removeUserData(res: NextApiResponse, session: SessionProps) {
    await db.deleteUser(session);
}

export function encodePayload({ user, owner, ...session }: SessionProps) {
    const context = session?.context?.split('/')[1] || '';

    return jwt.sign({ context, user, owner }, JWT_KEY, { expiresIn: '24h' });
}

export function decodePayload(encodedContext: string) {
    return jwt.verify(encodedContext, JWT_KEY);
}
