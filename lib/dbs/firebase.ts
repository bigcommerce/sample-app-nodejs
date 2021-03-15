import firebase from 'firebase/app';
import 'firebase/firestore';
import { SessionProps, StoreData, UserData } from '../../types/index';

// Firebase config and initialization
// Prod applications might use config file
const { FIRE_API_KEY, FIRE_DOMAIN, FIRE_PROJECT_ID } = process.env;

const firebaseConfig = {
    apiKey: FIRE_API_KEY,
    authDomain: FIRE_DOMAIN,
    projectId: FIRE_PROJECT_ID,
};

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const db = firebase.firestore();

// Firestore data management functions
export async function setUser({ context, user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;
    const storeId = context?.split('/')[1] || '';
    const ref = db.collection('users').doc(String(id));
    const data: UserData = { email, storeId };

    if (username) {
        data.username = username;
    }

    await ref.set(data, { merge: true });
}

export async function setStore(session: SessionProps) {
    const { access_token: accessToken, context, scope } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeId = context?.split('/')[1] || '';
    const ref = db.collection('store').doc(storeId);
    const data = { accessToken, scope };

    await ref.set(data);
}

export async function getStore() {
    const doc = await db.collection('store').limit(1).get();
    const [storeDoc] = doc?.docs ?? [];
    const storeData: StoreData = { ...storeDoc?.data(), storeId: storeDoc?.id };

    return storeDoc.exists ? storeData : null;
}

export async function getStoreToken(storeId: string) {
    if (!storeId) return null;
    const storeDoc = await db.collection('store').doc(storeId).get();

    return storeDoc.exists ? storeDoc.data()?.accessToken : null;
}

export async function deleteStore({ store_hash: storeId }: SessionProps) {
    const ref = db.collection('store').doc(storeId);

    await ref.delete();
}
