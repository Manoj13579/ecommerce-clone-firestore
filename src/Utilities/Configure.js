import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "daraz-14587.firebaseapp.com",
  projectId: "daraz-14587",
  storageBucket: "daraz-14587.appspot.com",
  messagingSenderId: "725653022546",
  appId: "1:725653022546:web:7a77adb2dfe24e645abc8b"
};


const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);