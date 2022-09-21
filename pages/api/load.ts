import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCVerify, getCheckoutById, setSession } from '../../lib/auth';
import { getSubscriptionBody } from '../../lib/checkout';

const buildRedirectUrl = (url: string, encodedContext: string) => {
    const [path, query = ''] = url.split('?');
    const queryParams = new URLSearchParams(`context=${encodedContext}&${query}`);

    return `${path}?${queryParams}`;
}

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify when app loaded (launch)
        const session = await getBCVerify(req.query);
        const { url } = session;
        const [,,pid] = url.match(/(\/upgrade)\/([0-9]+)/) ?? [];

        // If redirected from checkout, verify checkout
        if (pid) {
            const subId = await getCheckoutById(pid);
            if (subId !== null) {
                const subscriptionBody = getSubscriptionBody(String(subId));
                const response = await fetch(`${process.env.CHECKOUT_URL}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Auth-Token': process.env.CHECKOUT_TOKEN,
                        'X-Auth-Client': process.env.CHECKOUT_CLIENT,
                    },
                    body: JSON.stringify(subscriptionBody),
                });
                const { data: { account: { checkout: { status = '', items = {} } = {} } = {} } = {} } = await response.json();
                const trialEndDate = items?.edges?.[0]?.node?.pricingPlan?.trialDays ?? Date.now();
                const isPaidApp = status === 'COMPLETE';

                session.plan = { pid, isPaidApp, showPaidWelcome: isPaidApp, trialEndDate };
                session.url = '/';
            }
        }
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        await setSession(session);
        res.redirect(302, buildRedirectUrl(session.url, encodedContext));
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
