import * as mysql from 'mysql';
import { promisify } from 'util';
import { SessionProps, StoreData } from '../../types';

// For use with Heroku ClearDB
// Other mysql: https://www.npmjs.com/package/mysql#establishing-connections
const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
const query = promisify(connection.query.bind(connection));

// Use setUser for storing global user data (persists between installs)
export async function setUser({ user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;
    const userData = { email, userId: id, username };

    await query('REPLACE INTO users SET ?', userData);
}

export async function setStore(session: SessionProps) {
    const { access_token: accessToken, context, scope } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';
    const storeData: StoreData = { accessToken, scope, storeHash };

    await query('REPLACE INTO stores SET ?', storeData);
}

// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
    const { access_token: accessToken, context, user: { id } } = session;
    if (!id) return null;

    const storeHash = context?.split('/')[1] || '';
    const [oldAdmin] = await query('SELECT * FROM storeUsers WHERE isAdmin IS TRUE limit 1') ?? [];

    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
        // Nothing to update if admin the same
        if (oldAdmin?.userId === String(id)) return null;

        // Update admin (if different and previously installed)
        if (oldAdmin) {
            await query('UPDATE storeUsers SET isAdmin=0 WHERE isAdmin IS TRUE');
        }

        // Create a new record
        await query('INSERT INTO storeUsers SET ?', { isAdmin: true, storeHash, userId: id });
    } else {
        const storeUser = await query('SELECT * FROM storeUsers WHERE userId = ?', String(id));

        // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
        if (!storeUser.length) {
            await query('INSERT INTO storeUsers SET ?', { isAdmin: false, storeHash, userId: id });
        }
    }
}

export async function deleteUser({ user }: SessionProps) {
    await query('DELETE FROM storeUsers WHERE userId = ?', String(user?.id));
}

export async function getStore() {
    const results = await query('SELECT * FROM stores limit 1');

    return results.length ? results[0] : null;
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;

    const results = await query('SELECT accessToken FROM stores limit 1');

    return results.length ? results[0].accessToken : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    await query('DELETE FROM stores WHERE storeHash = ?', storeHash);
}
