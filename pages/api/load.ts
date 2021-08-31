import { NextApiRequest, NextApiResponse } from 'next';
import { encodePayload, getBCVerify, getSubscriptionById, setSession } from '../../lib/auth';

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

        if (pid) {
            const subId = await getSubscriptionById(pid) ?? '';
            if (subId) {
                const response = await fetch(`${process.env.CHECKOUT_URL}/subscriptions?subscriptionId=${subId}`, {
                    headers: {
                      'X-Auth-Token': process.env.CHECKOUT_TOKEN,
                      'X-Partner-ID': process.env.CHECKOUT_PARTNER,
                    }
                });
                const { data: [{ status = '', trial_ends_on: trialEndDate = Date.now() }] = [] } = await response.json();
                const isPaidApp = status === 'active';

                session.plan = { pid, isPaidApp, showPaidWelcome: isPaidApp, trialEndDate };
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
