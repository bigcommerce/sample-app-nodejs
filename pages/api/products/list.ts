import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeId } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeId);
        // Optional: pass in API params here
        const params = [
            'limit=11',
        ].join('&');

        const { data } = await bigcommerce.get(`/catalog/products?${params}`);
        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).end(message || 'Authentication failed, please re-install');
    }
}
