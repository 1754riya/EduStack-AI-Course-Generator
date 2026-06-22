import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "edustack-ai-course-generator.firebaseapp.com",
  projectId: "edustack-ai-course-generator",
  storageBucket: "edustack-ai-course-generator.firebasestorage.app",
  messagingSenderId: "269658819143",
  appId: "1:269658819143:web:b0a4c2ef4f750ebb25bf62",
  measurementId: "G-W69VPSN9QR",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
