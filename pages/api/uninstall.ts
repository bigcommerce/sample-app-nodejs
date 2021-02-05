import { NextApiRequest, NextApiResponse } from 'next';
import { getBCVerify } from '../../lib/auth';

export default async function uninstall(req: NextApiRequest, res: NextApiResponse) {
    try {
        await getBCVerify(req.query);

        res.status(200).end();
    } catch (error) {
        const { data, response } = error;
        res.status(response?.status || 500).json(data);
    }
}
