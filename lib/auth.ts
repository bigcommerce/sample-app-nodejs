import * as BigCommerce from 'node-bigcommerce';

// Create BigCommerce instance
// https://github.com/bigcommerce/node-bigcommerce
const bigcommerce = new BigCommerce({
    logLevel: 'info',
    clientId: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callback: process.env.AUTH_CALLBACK,
    responseType: 'json',
    headers: { 'Accept-Encoding': '*' },
    apiVersion: 'v3',
});

const bigcommerceSigned = new BigCommerce({
    secret: process.env.CLIENT_SECRET,
    responseType: 'json',
});

interface QueryParams {
    [key: string]: string | string[];
}

export function getBCAuth(query: QueryParams) {
    return bigcommerce.authorize(query);
}

export function getBCVerify({ signed_payload_jwt }: QueryParams) {
    return bigcommerceSigned.verifyJWT(signed_payload_jwt);
}
