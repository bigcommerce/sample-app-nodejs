import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify, setSession } from '../../lib/auth';

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query);

        await setSession(req, res, session);
        res.redirect(302, '/');
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json(message);
    }
}
