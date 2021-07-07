import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify, removeSession } from '../../lib/auth';

export default async function uninstall(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query);

        await removeSession(res, session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
