/**
 * Firebase Configuration for Mobile App
 *
 * NOTE: This file needs to be configured with your Firebase project settings
 * Get your config from Firebase Console > Project Settings > Your Apps
 */

// TODO: Install Firebase packages first:
// npm install firebase

/*
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// Copy this from Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Functions
const functions = getFunctions(app);

// For development with Firebase Emulators:
// Uncomment these lines when using local emulators
// import { connectAuthEmulator } from 'firebase/auth';
// import { connectFirestoreEmulator } from 'firebase/firestore';
// import { connectFunctionsEmulator } from 'firebase/functions';
//
// if (__DEV__) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export { auth, db, functions };
export default app;
*/

// Temporary placeholder until Firebase is installed
export const auth = null as any;
export const db = null as any;
export const functions = null as any;
