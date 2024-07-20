// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBau7Bp_jUqZKVsjBnJnZBmOSw1szgHLKU",
  authDomain: "project2-e7f24.firebaseapp.com",
  projectId: "project2-e7f24",
  storageBucket: "project2-e7f24.appspot.com",
  messagingSenderId: "898289414800",
  appId: "1:898289414800:web:9dadb64f6ed6e69fda1e15",
  measurementId: "G-R662C1YHWJ"
};


const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const realtimeDB = getDatabase(app);

export { realtimeDB };