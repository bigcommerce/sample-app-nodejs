import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, getSubscriptionInfo } from '../../../lib/auth';

export default async function subscription(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { plan, storeHash } = await getSession(req);
        const data = plan ?? await getSubscriptionInfo(storeHash);

        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
