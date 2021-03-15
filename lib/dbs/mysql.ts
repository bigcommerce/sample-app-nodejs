import * as mysql from 'mysql';
import { promisify } from 'util';
import { SessionProps, StoreData } from '../../types';

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
const query = promisify(connection.query.bind(connection));

export async function setUser({ context, user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;
    const storeId = context?.split('/')[1] || '';

    const userData = { email, userId: id, storeId, username };

    await query('REPLACE INTO users SET ?', userData);
}

export async function setStore(session: SessionProps) {
    const { access_token: accessToken, context, scope } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeId = context?.split('/')[1] || '';

    const storeData: StoreData = { accessToken, scope, storeId };
    await query('REPLACE INTO stores SET ?', storeData);
}

export async function getStore() {
    const results = await query('SELECT * from stores limit 1');

    return results.length ? results[0] : null;
}

export async function deleteStore({ store_hash: storeId }: SessionProps) {
    await query('DELETE FROM stores WHERE storeId = ?', storeId);
}
