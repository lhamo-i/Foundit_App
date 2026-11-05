
import { initializeApp, getApps, getApp } from 'firebase/app';

import {
  initializeAuth,
  getAuth,
  getReactNativePersistence
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Your existing Firebase project configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBkyBGQc5SCZ-ipMcz8dIl-ld1WZWbXIa8",
  authDomain: "foundit-ccc07.firebaseapp.com",
  projectId: "foundit-ccc07",
  storageBucket: "foundit-ccc07.firebasestorage.app",
  messagingSenderId: "386483542274",
  appId: "1:386483542274:web:808894fde0aeb34eb48a1b"
};

// Firebase configuration status
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('PASTE') &&
  !!firebaseConfig.projectId &&
  !firebaseConfig.projectId.startsWith('PASTE');

// Cloud Functions region
export const FUNCTIONS_REGION = 'asia-south1';

// Initialize Firebase App
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Authentication
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export Firebase services
export { app, auth, db, storage };
