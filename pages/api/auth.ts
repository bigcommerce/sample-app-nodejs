import { NextApiRequest, NextApiResponse } from 'next';
import { createAppExtension } from '@lib/appExtensions';
import { encodePayload, getBCAuth, setSession } from '../../lib/auth';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Authenticate the app on install
        const session = await getBCAuth(req.query);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering
        const { access_token: accessToken, context } = session;

        const storeHash = context?.split('/')[1] || '';

        await setSession(session);

        /**
         * For stores that do not have the app installed yet, create App Extensions when app is
         * installed.
         */

        const response = await fetch(
            `https://${process.env.API_URL}/stores/${storeHash}/graphql`,
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': accessToken,
                },
                body: JSON.stringify(createAppExtension()),
            }
        );
        const { errors } = await response.json();
        if (errors && errors.length > 0) {
            throw new Error(errors[0]?.message);
        }

        res.redirect(302, `/?context=${encodedContext}`);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
