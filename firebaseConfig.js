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
  apiKey: "AIzaSyA410D64yNeSdtpfBu7rDs1_mkqc5dkXJs",
  authDomain: "finals-gg.firebaseapp.com",
  databaseURL: "https://finals-gg-default-rtdb.firebaseio.com",
  projectId: "finals-gg",
  storageBucket: "finals-gg.firebasestorage.app",
  messagingSenderId: "884536190555",
  appId: "1:884536190555:web:26d96022e37d3ec1edc17e",
  measurementId: "G-FK8V7MYWWE",
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
