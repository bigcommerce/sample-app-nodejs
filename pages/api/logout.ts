import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, logoutUser } from '../../lib/auth';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession(req);

        await logoutUser(session);
        res.status(200).end();
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
