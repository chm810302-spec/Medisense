import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

try {
  if (getApps().length === 0) {
    // If apiKey is missing, initializeApp will throw an error. 
    // We catch it to prevent the entire server from crashing on boot if env vars are missing during build.
    if (!firebaseConfig.apiKey && typeof window === 'undefined') {
      console.warn("Firebase API Key is missing. Check your environment variables.");
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Fallback to avoid breaking the build process if possible
}

export { db };
