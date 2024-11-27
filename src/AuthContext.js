// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase-config'; // Import de l'authentification firebase
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Surveille les changements d'état de l'authentification (connexion/déconnexion)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Met à jour l'état de l'utilisateur
    });

    // Nettoyage de l'abonnement au changement d'état de l'authentification
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
