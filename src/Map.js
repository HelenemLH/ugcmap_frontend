import React, { useEffect, useState } from 'react'; // importation de React et des hooks
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // composants nécessaires pour la carte
import axios from 'axios'; // bibliothèque pour les requêtes API
import 'leaflet/dist/leaflet.css'; // style pour Leaflet
import L from 'leaflet'; // bibliothèque Leaflet pour personnaliser les icônes

const Map = () => {
  const [cinemas, setCinemas] = useState([]); // état pour stocker les cinémas
  const [userLocation, setUserLocation] = useState(null); // état pour la position de l'utilisateur
  const [map, setMap] = useState(null); // état pour l'objet de la carte

  useEffect(() => {
    // Récupérer la position de l'utilisateur en temps réel
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          if (map) {
            // Centrer la carte sur la position de l'utilisateur
            map.setView([position.coords.latitude, position.coords.longitude], map.getZoom());
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation : ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    // Récupérer les cinémas depuis l'API
    axios.get('http://localhost:3000/api/cinemas') 
      .then(response => {
        setCinemas(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des cinémas :', error);
      });
  }, [map]);

  // Définir les icônes en fonction du type de cinéma
  const getIcon = (type) => {
    const icons = {
      ugc: new L.Icon({
        iconUrl: '/images/ugc-logo.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
      mk2: new L.Icon({
        iconUrl: '/images/mk2-logo.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
      independent: new L.Icon({
        iconUrl: '/images/heart-icon.png',
        iconSize: [25, 25],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
    };
    return icons[type] || icons.independent; // par défaut, utiliser l'icône indépendante
  };

  // Icône pour la position de l'utilisateur
  const userIcon = new L.Icon({
    iconUrl: '/images/target-icon.png', // Icône pour l'utilisateur
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -30],
  });

  return (
    <div className="map-container">
      <MapContainer
        center={[48.8566, 2.3522]} // Position initiale de la carte
        zoom={12}
        style={{ height: '100vh', width: '100%' }}
        whenCreated={setMap} // Cette fonction permet de récupérer l'objet de la carte
      >
        {/* Couche OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Afficher les cinémas */}
        {cinemas.map(cinema => (
          <Marker
            key={cinema.id} // Utiliser un ID unique pour chaque marqueur
            position={[cinema.latitude, cinema.longitude]} // Position du cinéma
            icon={getIcon(cinema.type)} // Icône basée sur le type
          >
            <Popup className="cinema-popup">
              <div>
                <strong>{cinema.name}</strong><br />
                {cinema.address}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Marqueur pour la position de l'utilisateur */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup className="user-popup">
              <strong>Vous êtes ici</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
