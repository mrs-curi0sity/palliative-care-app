import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Fügen Sie hier Ihre kopierten Konfigurationsdaten ein
  apiKey: "AIzaSyAeR2ryiI6XNXJRN0wC6px1VVpWPvXBUOs",
  authDomain: "palliative-care-app-2024.firebaseapp.com",
  projectId: "palliative-care-app-2024",
  storageBucket: "palliative-care-app-2024.appspot.com",
  messagingSenderId: "832640585978",
  appId: "1:832640585978:web:3b89711a7063c310353943",
  measurementId: "G-CFZDR93XYN"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);