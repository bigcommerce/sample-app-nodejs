import { NextApiRequest, NextApiResponse } from 'next';
import { getBCAuth } from '../../lib/auth';
import { setCookie } from '../../lib/cookie';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Authenticate the app on install
        const session = await getBCAuth(req.query);

        setCookie(res, session);
        res.redirect(302, '/');
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json(message);
    }
}
