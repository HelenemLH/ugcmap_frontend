import React, { useEffect, useState } from 'react'; // importation de react et des hooks
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // importation des composants nécessaires pour la carte
import axios from 'axios'; // importation d'axios pour récupérer les données
import 'leaflet/dist/leaflet.css'; // importation du css pour leaflet
import L from 'leaflet'; // importation de leaflet pour personnaliser les icônes

const Map = () => {
  const [cinemas, setCinemas] = useState([]); // déclaration d'un state pour stocker les cinémas récupérés
  const [userLocation, setUserLocation] = useState(null); // Pour stocker la position de l'utilisateur

  useEffect(() => {
    // Récupération de la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation : ", error);
        }
      );
    } else {
      console.log("La géolocalisation n'est pas supportée par ce navigateur.");
    }

    // Récupération des cinémas depuis l'API
    axios.get('http://localhost:3001/cinemas')
      .then(response => {
        setCinemas(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des cinémas:', error);
      });
  }, []);

  // Icône personnalisée pour les marqueurs des cinémas
  const customIcon = new L.Icon({
    iconUrl: '/images/my-icon.png',  // chemin vers l'image de l'icône
    iconSize: [30, 30],  // taille de l'icône
    iconAnchor: [15, 30],  // point d'ancrage de l'icône
    popupAnchor: [0, -30],  // position du popup par rapport à l'icône
  });

  // Icône pour la position de l'utilisateur 
  const userIcon = new L.Icon({
    iconUrl: '/images/target-icon.png',  // chemin vers l'image de la cible
    iconSize: [40, 40],  // taille de l'icône de la cible
    iconAnchor: [20, 40],  // ancrage centré au bas de l'icône
    popupAnchor: [0, -30],  // position du popup
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
      {/* Marker pour la position de l'utilisateur */}
      {userLocation && (
        <Marker 
          position={[userLocation.latitude, userLocation.longitude]} 
          icon={userIcon} // icône cible
        >
          <Popup>
            <strong>Vous êtes ici</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
