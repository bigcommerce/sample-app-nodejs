import { parse, serialize } from 'cookie';
import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { SessionProps } from '../types';
import * as fire from './firebase';

const { COOKIE_NAME, JWT_KEY } = process.env;
const MAX_AGE = 60 * 60 * 24; // 24 hours

export async function setCookie(res: NextApiResponse, session: SessionProps) {
    let { access_token: token, scope } = session;
    const { context } = session;
    const storeId = context?.split('/')[1] || '';

    if (!token) {
        ({ accessToken: token, scope } = await fire.getStore());
    }

    const cookie = serialize(COOKIE_NAME, encode(token, scope, storeId), {
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
    });

    res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: NextApiRequest) {
    if (req.cookies) return req.cookies; // API routes don't parse cookies

    const cookie = req.headers?.cookie;

    return parse(cookie || '');
}

export function getCookie(req: NextApiRequest) {
    return parseCookies(req)[COOKIE_NAME];
}

export function removeCookie(res: NextApiResponse) {
    const cookie = serialize(COOKIE_NAME, '', { maxAge: -1, path: '/' });

    res.setHeader('Set-Cookie', cookie);
}

export function encode(token: string, scope: string, storeId: string) {
    return jwt.sign({ accessToken: token, scope, storeId }, JWT_KEY);
}

export function decode(encodedCookie: string) {
    return jwt.verify(encodedCookie, JWT_KEY);
}
