import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'url';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');
        const { page, limit, sort, direction, include } = req.query;
        const params = new URLSearchParams({ page, limit, include, ...(sort && {sort, direction}) }).toString();

        const rawResponse = await bigcommerce.get(`/orders?${params}`);
        const response = await Promise.all(rawResponse.map(async (order: any) => {
            const { id } = order;
            const products = await bigcommerce.get(order.products.resource);
            const shippingAddresses = await bigcommerce.get(order.shipping_addresses.resource);
            const coupons = await bigcommerce.get(order.coupons.resource);
            return { ...order, products, shippingAddresses, coupons };
        }));

        res.status(200).json(response);
    } catch (error) {
        const { message, response } = error;
        console.log('list: error', error);
        res.status(response?.status || 500).json({ message });
    }
}
