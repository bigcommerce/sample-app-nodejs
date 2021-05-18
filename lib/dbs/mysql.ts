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
    const { access_token: accessToken, context, user: { id: userId } } = session;
    if (!userId) return null;

    const storeHash = context?.split('/')[1] || '';
    const sql = 'SELECT * FROM storeUsers WHERE userId = ? AND storeHash = ?';
    const values = [String(userId), storeHash];
    const storeUser = await query(sql, values);

    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
        // Create a new admin user if none exists
        if (!storeUser.length) {
            await query('INSERT INTO storeUsers SET ?', { isAdmin: true, storeHash, userId });
        } else if (!storeUser[0]?.isAdmin) {
            await query('UPDATE storeUsers SET isAdmin=1 WHERE userId = ? AND storeHash = ?', values);
        }
    } else {
        // Create a new user if it doesn't exist (non-store owners added here for multi-user apps)
        if (!storeUser.length) {
            await query('INSERT INTO storeUsers SET ?', { isAdmin: false, storeHash, userId });
        }
    }
}

export async function deleteUser({ user }: SessionProps) {
    await query('DELETE FROM storeUsers WHERE userId = ?', String(user?.id));
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;

    const results = await query('SELECT accessToken FROM stores WHERE storeHash = ?', storeHash);

    return results.length ? results[0].accessToken : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    await query('DELETE FROM stores WHERE storeHash = ?', storeHash);
}
