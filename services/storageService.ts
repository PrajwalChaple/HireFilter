import {
    getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { User, UserRole, Job, Application } from '../types';
import { db, auth } from './firebase';

const RECRUITERS_COLLECTION = 'recruiters';
const CANDIDATES_COLLECTION = 'candidates';
const JOBS_COLLECTION = 'jobs';
const APPS_COLLECTION = 'applications';

// Internal memory state to avoid layout flashes
let currentUserState: User | null = null;

export const storageService = {
    // --- Auth & Users ---

    // Start listening to Auth state changes and sync with firestore
    initAuthListener: (onUserChanged: (user: User | null) => void) => {
        return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
            if (fbUser) {
                // Check recruiters first
                const recRef = doc(db, RECRUITERS_COLLECTION, fbUser.uid);
                const recSnap = await getDoc(recRef);

                if (recSnap.exists()) {
                    const u = recSnap.data() as User;
                    currentUserState = u;
                    onUserChanged(u);
                } else {
                    // Check candidates
                    const candRef = doc(db, CANDIDATES_COLLECTION, fbUser.uid);
                    const candSnap = await getDoc(candRef);

                    if (candSnap.exists()) {
                        const u = candSnap.data() as User;
                        currentUserState = u;
                        onUserChanged(u);
                    } else {
                        // Edge case: Auth exists but doc doesn't. Admin manual delete?
                        currentUserState = null;
                        onUserChanged(null);
                    }
                }
            } else {
                currentUserState = null;
                onUserChanged(null);
            }
        });
    },

    getCurrentUser: (): User | null => currentUserState,

    signup: async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
        // 1. Create in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // 2. Setup user document in Firestore
        const newUser: User = {
            id: fbUser.uid,
            email,
            name,
            role,
        };

        const collectionName = role === UserRole.ADMIN ? RECRUITERS_COLLECTION : CANDIDATES_COLLECTION;
        await setDoc(doc(db, collectionName, fbUser.uid), newUser);
        currentUserState = newUser;
        return newUser;
    },

    login: async (email: string, password: string): Promise<User> => {
        // 1. Sign in via Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // 2. Fetch role & data
        let user: User | null = null;

        const recRef = doc(db, RECRUITERS_COLLECTION, fbUser.uid);
        const recSnap = await getDoc(recRef);

        if (recSnap.exists()) {
            user = recSnap.data() as User;
        } else {
            const candRef = doc(db, CANDIDATES_COLLECTION, fbUser.uid);
            const candSnap = await getDoc(candRef);
            if (candSnap.exists()) {
                user = candSnap.data() as User;
            }
        }

        if (!user) {
            throw new Error("User record not found in either recruiters or candidates collections.");
        }

        currentUserState = user;
        return user;
    },

    logout: async () => {
        await signOut(auth);
        currentUserState = null;
    },

    // --- Jobs Focus ---
    saveJob: async (job: Job) => {
        const jobRef = doc(db, JOBS_COLLECTION, job.id);
        await setDoc(jobRef, job);
    },

    getJob: async (id: string): Promise<Job | null> => {
        const jobRef = doc(db, JOBS_COLLECTION, id);
        const snap = await getDoc(jobRef);
        return snap.exists() ? (snap.data() as Job) : null;
    },

    getJobsByCreator: async (creatorId: string): Promise<Job[]> => {
        const q = query(collection(db, JOBS_COLLECTION), where('creatorId', '==', creatorId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as Job);
    },

    getPublishedJobs: async (): Promise<Job[]> => {
        const q = query(collection(db, JOBS_COLLECTION), where('status', '==', 'PUBLISHED'));
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as Job);
    },

    // --- Applications Focus ---
    saveApplication: async (app: Application) => {
        const appRef = doc(db, APPS_COLLECTION, app.id);
        await setDoc(appRef, app);
    },

    updateApplication: async (updatedApp: Application) => {
        const appRef = doc(db, APPS_COLLECTION, updatedApp.id);
        await updateDoc(appRef, { ...updatedApp });
    },

    getApplicationsForJob: async (jobId: string): Promise<Application[]> => {
        const q = query(collection(db, APPS_COLLECTION), where('jobId', '==', jobId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as Application);
    },

    getApplicationsByCandidate: async (candidateId: string): Promise<Application[]> => {
        const q = query(collection(db, APPS_COLLECTION), where('candidateId', '==', candidateId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data() as Application);
    },

    hasApplied: async (jobId: string, candidateId: string): Promise<boolean> => {
        const q = query(collection(db, APPS_COLLECTION),
            where('jobId', '==', jobId),
            where('candidateId', '==', candidateId)
        );
        const snap = await getDocs(q);
        return !snap.empty;
    },

    getApplication: async (appId: string): Promise<Application | null> => {
        const appRef = doc(db, APPS_COLLECTION, appId);
        const snap = await getDoc(appRef);
        return snap.exists() ? (snap.data() as Application) : null;
    }
};
