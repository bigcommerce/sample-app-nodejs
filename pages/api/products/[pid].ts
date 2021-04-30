import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        query: { pid },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const { accessToken, storeId } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeId);

                const { data } = await bigcommerce.get(`/catalog/products/${pid}`);
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).end(message || 'Authentication failed, please re-install');
            }
            break;
        case 'PUT':
            try {
                const { accessToken, storeId } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeId);

                const { data } = await bigcommerce.put(`/catalog/products/${pid}`, body);
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).end(message || 'Authentication failed, please re-install');
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }


}
