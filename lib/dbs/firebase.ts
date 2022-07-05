import { initializeApp } from 'firebase/app';
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { SessionProps, UserData } from '../../types';

// Firebase config and initialization
// Prod applications might use config file
const { FIRE_API_KEY, FIRE_DOMAIN, FIRE_PROJECT_ID } = process.env;

const firebaseConfig = {
    apiKey: FIRE_API_KEY,
    authDomain: FIRE_DOMAIN,
    projectId: FIRE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore data management functions
export async function setUser({ user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;
    const ref = doc(db, 'users', String(id));
    const data: UserData = { email };

    if (username) {
        data.username = username;
    }

    await setDoc(ref, data, { merge: true });
}

export async function setStore(session: SessionProps) {
    const {
        access_token: accessToken,
        context,
        scope,
        user: { id },
    } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';
    const ref = doc(db, 'store', storeHash);
    const data = { accessToken, adminId: id, scope };

    await setDoc(ref, data);
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;
    const storeDoc = await getDoc(doc(db, 'store', storeHash));

    return storeDoc.data()?.accessToken ?? null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    const ref = doc(db, 'store', storeHash);

    await deleteDoc(ref);
}
