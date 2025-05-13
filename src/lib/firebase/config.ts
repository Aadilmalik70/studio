
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Critical validation: Throw an error if essential Firebase config variables are missing.
if (!apiKey || !authDomain || !projectId) {
  const errorMessage = `CRITICAL Firebase Configuration Error:
    One or more required Firebase environment variables are missing or empty.
    Firebase Auth cannot be initialized without these.
    Please ensure the following are correctly set in your .env file and that the application is restarted if changes were made:
    - NEXT_PUBLIC_FIREBASE_API_KEY: ${apiKey ? 'Provided' : 'MISSING or EMPTY'}
    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${authDomain ? 'Provided' : 'MISSING or EMPTY'}
    - NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${projectId ? 'Provided' : 'MISSING or EMPTY'}
    The application cannot function correctly until these are resolved. Refer to README.md for setup instructions.`;
  console.error(errorMessage);
  // This will stop the application from attempting to use a misconfigured Firebase.
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };

