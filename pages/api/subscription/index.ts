import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, getSubscriptionInfo, setWelcome } from '../../../lib/auth';

export default async function subscription(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { plan, storeHash } = await getSession(req);
        const data = plan ?? await getSubscriptionInfo(storeHash);

        if (data?.showPaidWelcome) setWelcome(storeHash, false);

        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
