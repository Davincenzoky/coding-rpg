import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKQvSGq-kRlqEWeh4_aH7F-N5n8uuDmEQ",
  authDomain: "code-defense-a32fd.firebaseapp.com",
  projectId: "code-defense-a32fd",
  storageBucket: "code-defense-a32fd.firebasestorage.app",
  messagingSenderId: "999402612594",
  appId: "1:999402612594:web:95bf1a80f9bffe92db5feb",
  measurementId: "G-M919TQ4HLW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch(() => {});
