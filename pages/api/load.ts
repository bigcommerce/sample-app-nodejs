import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify } from '../../lib/auth';

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getBCVerify(req.query);

        res.redirect(302, '/');
    } catch (error) {
        const { data, response } = error;
        res.status(response?.status || 500).json(data);
    }
}
