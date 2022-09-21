import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, setCheckout } from '../../../lib/auth';
import { getCheckoutBody } from '../../../lib/checkout';

export default async function checkout(req: NextApiRequest, res: NextApiResponse) {
    const { query: { pid } } = req;

    try {
        const { storeHash } = await getSession(req);
        const checkoutBody = getCheckoutBody(String(pid), storeHash);
        const response = await fetch(process.env.CHECKOUT_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': process.env.CHECKOUT_TOKEN,
                'X-Auth-Client': process.env.CHECKOUT_CLIENT,
            },
            body: JSON.stringify(checkoutBody),
        });
        const { data, errors } = await response.json();

        if (data === null && errors[0]?.message ) {
            throw new Error(errors[0]?.message);
        }

        const checkoutId = data?.checkout?.createCheckout?.checkout?.id.split('/')[3] ?? '';
        if (checkoutId) setCheckout(String(pid), checkoutId);

        res.status(200).json(data?.checkout?.createCheckout?.checkout);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
