import React, { useEffect, useState } from 'react'; // importation de react et des hooks
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // importation des composants nécessaires pour la carte
import axios from 'axios'; // importation d'axios pour récupérer les données
import 'leaflet/dist/leaflet.css'; // importation du css pour leaflet
import L from 'leaflet'; // importation de leaflet pour personnaliser les icônes

const Map = () => {
  const [cinemas, setCinemas] = useState([]); // déclaration d'un state pour stocker les cinémas récupérés

  useEffect(() => {
    // utilisation d'axios pour récupérer les données de l'api
    axios.get('http://localhost:3001/cinemas') // requête vers l'api
      .then(response => {
        // si la requête réussit
        setCinemas(response.data); // mise à jour du state avec les données
      })
      .catch(error => {
        // si une erreur se produit
        console.error('erreur lors de la récupération des cinémas:', error);
      });
  }, []); // le tableau vide [] signifie que l'effet ne sera exécuté qu'une seule fois lors du montage du composant

  // création d'une icône personnalisée pour les marqueurs
  const customIcon = new L.Icon({
    iconUrl: '/images/my-icon.png',  // chemin vers l'image de l'icône
    iconSize: [30, 30],  // taille de l'icône
    iconAnchor: [15, 30],  // point d'ancrage de l'icône (pour que l'icône soit bien centrée)
    popupAnchor: [0, -30],  // position du popup par rapport à l'icône
  });

  return (
    // création du conteneur de la carte
    <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: '100vh', width: '100%' }}>
      {/* couche de tuiles avec OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* affichage des marqueurs pour chaque cinéma */}
      {cinemas.map(cinema => (
        <Marker
          key={cinema.name} // clé unique pour chaque marqueur
          position={[cinema.latitude, cinema.longitude]}  // position du marqueur
          icon={customIcon}  // icône personnalisée
        >
          <Popup>
            <div style={{
              backgroundColor: 'white', 
              padding: '10px', 
              borderRadius: '5px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)' 
            }}>
              <strong>{cinema.name}</strong><br />
              {cinema.address}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;  
