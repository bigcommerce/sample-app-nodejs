import { NextApiRequest, NextApiResponse } from 'next';
import { createAppExtension, getAppExtensions } from '@lib/appExtensions';
import { getStoreToken } from '@lib/dbs/firebase';
import { encodePayload, getBCVerify, setSession } from '../../lib/auth';

const buildRedirectUrl = (url: string, encodedContext: string) => {
    const [path, query = ''] = url.split('?');
    const queryParams = new URLSearchParams(
        `context=${encodedContext}&${query}`
    );

    return `${path}?${queryParams}`;
};

export default async function load(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verify when app loaded (launch)
        const session = await getBCVerify(req.query);
        const encodedContext = encodePayload(session); // Signed JWT to validate/ prevent tampering

        const { sub } = session;
        const storeHash = sub?.split('/')[1] || '';

        const accessToken = await getStoreToken(storeHash);

        await setSession(session);

        /**
         * For stores that do not have app extensions installed yet, create app extensions when app is
         * loaded
         */

        const existingAppExtensions = await fetch(
            `https://${process.env.API_URL}/stores/${storeHash}/graphql`,
            {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': accessToken,
                },
                body: JSON.stringify(getAppExtensions()),
            }
        );

        const { data } = await existingAppExtensions.json();

        const existingAppExtensionIds = data?.store?.appExtensions?.edges;

        // If there are no app extensions returned, we assume we have not
        // installed app extensions on this store, so we must install them.
        if (!existingAppExtensionIds?.length) {
            const createAppExtensionRequest = await createAppExtension();

            // Make fetch to create the app extensions
            const createResponse = await fetch(
                `${process.env.API_BASE_URL}/stores/${storeHash}/graphql`,
                {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'x-auth-token': accessToken,
                    },
                    body: JSON.stringify(createAppExtensionRequest),
                }
            );
            const response = await createResponse.json();

            // Handel error if app extension creation fails
            if (response.data === null && response.errors?.length > 0) {
                throw new Error(response.errors[0]?.message);
            }
        }

        res.redirect(302, buildRedirectUrl(session.url, encodedContext));
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
