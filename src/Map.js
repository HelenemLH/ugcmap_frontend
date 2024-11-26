import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Map = () => {
  const [cinemas, setCinemas] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [routeControl, setRouteControl] = useState(null); // Stocke l'itinéraire

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
    return icons[type] || icons.independent; 
  };

  // Icône pour la position de l'utilisateur
  const userIcon = new L.Icon({
    iconUrl: '/images/target-icon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -30],
  });

  // Fonction pour calculer l'itinéraire vers le cinéma sélectionné
  const calculateRoute = (cinema) => {
    if (userLocation && map) {
      const userLatLng = L.latLng(userLocation.latitude, userLocation.longitude);
      const cinemaLatLng = L.latLng(cinema.latitude, cinema.longitude);

      if (routeControl) {
        map.removeControl(routeControl); // Supprimer l'ancien itinéraire avant d'en ajouter un nouveau
      }

      // Créer et ajouter le contrôle de routage sur la carte
      const newRouteControl = L.Routing.control({
        waypoints: [userLatLng, cinemaLatLng],
        routeWhileDragging: true,
      }).addTo(map);

      // Mettre à jour l'état avec le nouveau contrôle de routage
      setRouteControl(newRouteControl);
    }
  };

  return (
    <MapContainer
      center={[48.8566, 2.3522]} 
      zoom={12}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => setMap(mapInstance)}
    >
      {/* Couche OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {/* Afficher les cinémas */}
      {cinemas.map(cinema => (
        <Marker
          key={cinema.id}
          position={[cinema.latitude, cinema.longitude]}
          icon={getIcon(cinema.type)}
        >
          <Popup>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            }}>
              <strong>{cinema.name}</strong><br />
              {cinema.address}
              <br />
              <button onClick={() => calculateRoute(cinema)}>Calculer l'itinéraire</button>
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
          <Popup>
            <strong>Vous êtes ici</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
