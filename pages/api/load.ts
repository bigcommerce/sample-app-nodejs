import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify, setSession } from '../../lib/auth';

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query);
        const storeHash = session?.context?.split('/')[1] || '';

        await setSession(session);
        res.redirect(302, `/?context=${storeHash}`);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json(message);
    }
}
