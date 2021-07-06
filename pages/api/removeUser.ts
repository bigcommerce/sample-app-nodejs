import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify, removeUserData } from '../../lib/auth';

export default async function removeUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getBCVerify(req.query);

        await removeUserData(session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
