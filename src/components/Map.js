import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config'; // Import Firebase Auth
import { onAuthStateChanged } from 'firebase/auth'; 



const Map = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <h2>Your Map</h2>
      {/* Votre composant de carte ici */}
    </div>
  );
};

export default Map;
