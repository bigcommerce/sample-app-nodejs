import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient } from '../../../lib/auth';
import { decode, getCookie } from '../../../lib/cookie';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = getCookie(req);
        const { accessToken, storeId } = (cookies && decode(cookies)) ?? null;
        const bigcommerce = bigcommerceClient(accessToken, storeId);

        const { data } = await bigcommerce.get('/catalog/summary');
        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).end(message || 'Authentication failed, please re-install');
    }
}
