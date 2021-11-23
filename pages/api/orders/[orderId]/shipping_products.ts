import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../../lib/auth';

export default async function shippingAddressesAndProducts(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { orderId },
        method,
    } = req;

    try {
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');

        switch (method) {
            case 'GET': {
                const shipping_addresses = await bigcommerce.get(`/orders/${orderId}/shipping_addresses`);
                const products =  await bigcommerce.get(`/orders/${orderId}/products`);

                res.status(200).json({ shipping_addresses, products });

                break;
            }
        
            default: {
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
            }
        }
        
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
