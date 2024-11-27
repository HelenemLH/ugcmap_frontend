import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuration Firebase avec les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Authentification Firebase
const auth = getAuth(app);

// Export des objets pour les utiliser dans d'autres fichiers
export { auth };
export default firebaseConfig;
