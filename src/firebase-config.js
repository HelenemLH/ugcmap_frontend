import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJFof0QpVtP-jUuT4eVGgnmfZR3fS_8fk",
  authDomain: "cinemap-8032e.firebaseapp.com",
  projectId: "cinemap-8032e",
  storageBucket: "cinemap-8032e.appspot.com",  
  messagingSenderId: "636280767932",
  appId: "1:636280767932:web:9d618eb846f92ce5bf97b9",
  measurementId: "G-KTZSKZ4V8W"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Authentification Firebase
const auth = getAuth(app);

// Export des objets pour les utiliser dans d'autres fichiers
export { auth };
export default firebaseConfig;
