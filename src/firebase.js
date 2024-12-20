/**
 * Firebase configuration object containing keys and identifiers for the app.
 *
 * @type {Object}
 * @property {string} apiKey - Your Firebase API key.
 * @property {string} authDomain - Your Firebase Auth domain.
 * @property {string} projectId - Your Firebase project ID.
 * @property {string} storageBucket - Your Firebase storage bucket.
 * @property {string} messagingSenderId - Your Firebase messaging sender ID.
 * @property {string} appId - Your Firebase app ID.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "f24-capstone.firebaseapp.com",
  projectId: "f24-capstone",
  storageBucket: "f24-capstone.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

/**
 * Initializes the Firebase app with the provided configuration.
 *
 * @type {import("firebase/app").FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 *
 * @type {import("firebase/auth").Auth}
 */
export const auth = getAuth(app);

/**
 * Firestore database instance.
 *
 * @type {import("firebase/firestore").Firestore}
 */
export const db = getFirestore(app);
