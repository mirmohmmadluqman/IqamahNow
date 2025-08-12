import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "iqamahnow",
  "appId": "1:745341985731:web:010c304a8263e0f9575376",
  "storageBucket": "iqamahnow.firebasestorage.app",
  "apiKey": "AIzaSyB0qvHVBD0CdRwqz2shnLLujGxv3uaDjG4",
  "authDomain": "iqamahnow.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "745341985731"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
