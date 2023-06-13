import { NextApiRequest, NextApiResponse } from 'next';
import { createAppExtension } from '@lib/appExtensions';
import { encodePayload, getBCAuth, setSession } from '../../lib/auth';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const isAppExtensionsScopeEnabled = req.query.scope.includes('store_app_extensions_manage');

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

        if (isAppExtensionsScopeEnabled) {
            await createAppExtension({accessToken, storeHash})
        } else {
          console.warn("WARNING: App extensions scope is not enabled yet. To register app extensions update the scope in Developer Portal: https://devtools.bigcommerce.com");
        }

        res.redirect(302, `/?context=${encodedContext}`);
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
