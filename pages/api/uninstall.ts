import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify } from '../../lib/auth';
import { removeCookie } from '../../lib/cookie';

export default async function uninstall(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getBCVerify(req.query);

        removeCookie(res);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json(message);
    }
}
