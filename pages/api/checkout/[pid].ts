import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, setSubscription } from '../../../lib/auth';
import { getCheckoutBody } from '../../../lib/checkout';

export default async function checkout(req: NextApiRequest, res: NextApiResponse) {
    const { query: { pid } } = req;

    try {
        const { storeHash } = await getSession(req);
        const checkoutBody = getCheckoutBody(String(pid), storeHash);
        const response = await fetch(`${process.env.CHECKOUT_URL}/checkouts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': process.env.CHECKOUT_TOKEN,
              'X-Partner-ID': process.env.CHECKOUT_PARTNER,
            },
            body: JSON.stringify(checkoutBody)
        });
        const { data } = await response.json();
        const subId = data?.line_items?.[0]?.subscription_id ?? '';

        if (subId) setSubscription(String(pid), subId);

        res.status(200).json(data);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
