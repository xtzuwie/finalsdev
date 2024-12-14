import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Firebase configuration object
const firebaseConfig = {
  apiKey: "REPLACE YOUR FIREBASE API KEY",
  authDomain: "REPLACE YOUR FIREBASE DOMAIN",
  databaseURL: "REPLACE WITH YOUR URL",
  projectId: "FIREBASE ID",
  storageBucket: "replace-yours.firebasestorage.app",
  messagingSenderId: "REPLACE WITH YOUR ID",
  appId: "1:884536190555:web:26d96022e37d3ec1edc17e",
  measurementId: "replace with ur id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Initialize Firestore
const firestore = getFirestore(app); // Firestore Integ

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, db, firestore };
