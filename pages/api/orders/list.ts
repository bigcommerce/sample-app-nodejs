import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'url';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');
        const bigcommerceV3 = bigcommerceClient(accessToken, storeHash);
        const { page, limit, sort, direction, include } = req.query;
        const params = new URLSearchParams({ page, limit, include, ...(sort && {sort, direction}) }).toString();

        const rawResponse = await bigcommerce.get(`/orders?${params}`);
        const response = await Promise.all(rawResponse.map(async (order: any) => {
            const { id } = order;
            const rawProducts = await bigcommerce.get(order.products.resource);
            const products = await Promise.all(rawProducts.map(async (product: any) => {
                if (!product.variant_id) {
                    return bigcommerceV3.get(`/catalog/products/${product.product_id}`, { include: 'primary_image' });
                } else {
                    return bigcommerceV3.get(`/catalog/products/${product.product_id}/variants/${product.variant_id}`, { include: 'primary_image' });
                }
            }))
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
