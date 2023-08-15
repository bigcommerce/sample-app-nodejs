import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'url';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);
        const { page, limit, sort, direction } = req.query;
        const params = new URLSearchParams({ page, limit, ...(sort && {sort, direction}) }).toString();

        const response = await bigcommerce.get(`/catalog/products?${params}`);
        res.status(200).json(response);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
