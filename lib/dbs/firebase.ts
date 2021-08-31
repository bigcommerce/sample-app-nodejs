import { initializeApp } from 'firebase/app';
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { SessionProps, UserData } from '../../types';
import { trialDays } from '../checkout';

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

// Persist subscription info
export async function setSubscriptionId(pid: string, subscriptionId: string) {
    if (!pid || !subscriptionId) return null;

    const ref = db.collection('subscription').doc(pid);
    await ref.set({ subscriptionId });
}

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

export async function setStorePlan(session: SessionProps) {
    const { access_token: accessToken, context, plan, sub } = session;
    // Only set on app install or subscription verification (load)
    if ((!accessToken && !plan?.pid) || (plan && !plan.isPaidApp)) return null;

    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';

    if (!plan?.pid && await getStorePlan(storeHash)) return null; // Return early if set

    const defaultEnd = Date.now() + (trialDays * 24 * 60 * 60 * 1000);
    const { pid = '', isPaidApp = false, showPaidWelcome = false, trialEndDate = defaultEnd } = plan ?? {};
    const ref = db.collection('plan').doc(storeHash);
    const data = { pid, isPaidApp, showPaidWelcome, trialEndDate };

    await ref.set(data);
}

export async function setStoreWelcome(storeHash: string, show: boolean) {
    if (!storeHash) return null;
    const ref = db.collection('plan').doc(storeHash);

    await ref.set({ showPaidWelcome: show }, { merge: true });
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

export async function getStorePlan(storeHash: string) {
    if (!storeHash) return null;

    const doc = await db.collection('plan').doc(storeHash).get();

    return doc?.exists ? doc.data() : null;
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;
    const storeDoc = await getDoc(doc(db, 'store', storeHash));

    return storeDoc.data()?.accessToken ?? null;
}

export async function getSubscriptionId(pid: string) {
    if (!pid) return null;
    const doc = await db.collection('subscription').doc(pid).get();

    return doc?.exists ? doc.data()?.subscriptionId : null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    const ref = doc(db, 'store', storeHash);

    await deleteDoc(ref);
}
