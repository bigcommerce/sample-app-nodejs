import * as mysql from 'mysql';
import { promisify } from 'util';
import { SessionProps, StoreData } from '../../types';

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
const query = promisify(connection.query.bind(connection));

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

export async function getStore() {
    const results = await query('SELECT * from stores limit 1');

    return results.length ? results[0] : null;
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;

    const results = await query('SELECT accessToken from stores limit 1');

    return results.length ? results[0].accessToken : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    await query('DELETE FROM stores WHERE storeHash = ?', storeHash);
}
