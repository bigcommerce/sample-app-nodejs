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

// Use setUser for storing global user data (persists between installs)
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

// User management for multi-user apps
// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
    const {
        access_token: accessToken,
        context,
        owner,
        sub,
        user: { id: userId },
    } = session;
    if (!userId) return null;

    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const documentId = `${userId}_${storeHash}`; // users can belong to multiple stores
    const ref = doc(db, 'storeUsers', documentId);
    const storeUser = await getDoc(ref);

    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
        // Create a new admin user if none exists
        if (!storeUser.exists()) {
            await setDoc(ref, { storeHash, isAdmin: true });
        } else if (!storeUser.data()?.isAdmin) {
            await updateDoc(ref, { isAdmin: true });
        }
    } else {
        // Create a new user if it doesn't exist
        if (!storeUser.exists()) {
            await setDoc(ref, { storeHash, isAdmin: owner.id === userId }); // isAdmin true if owner == user
        }
    }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const docId = `${user?.id}_${storeHash}`;
    const ref = doc(db, 'storeUsers', docId);

    await deleteDoc(ref);
}

export async function hasStoreUser(storeHash: string, userId: string) {
    if (!storeHash || !userId) return false;

    const docId = `${userId}_${storeHash}`;
    const userDoc = await getDoc(doc(db, 'storeUsers', docId));

    return userDoc.exists();
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
