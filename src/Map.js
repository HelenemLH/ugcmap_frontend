// src/Map.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { auth } from "./firebase-config"; // Importer l'authentification Firebase
import { onAuthStateChanged } from "firebase/auth"; // Pour écouter les changements de l'état d'authentification

const Map = () => {
  const [cinemas, setCinemas] = useState([]); 
  const [userLocation, setUserLocation] = useState(null); 
  const [map, setMap] = useState(null);
  const [user, setUser] = useState(null); // Utilisateur connecté
  const [favorites, setFavorites] = useState([]); // Cinémas favoris

  useEffect(() => {
    // Vérifier si un utilisateur est connecté
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Récupérer les cinémas depuis l'API
    axios
      .get("http://localhost:3000/api/cinemas")
      .then((response) => {
        setCinemas(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des cinémas :", error);
      });
  }, []);

  // Ajouter un cinéma aux favoris
  const addToFavorites = (cinema) => {
    if (user) {
      setFavorites([...favorites, cinema]);
      localStorage.setItem("favorites", JSON.stringify([...favorites, cinema])); // Sauvegarder dans localStorage
    } else {
      alert("Vous devez être connecté pour ajouter aux favoris.");
    }
  };

  // Définir les icônes en fonction du type de cinéma
  const getIcon = (type) => {
    const icons = {
      ugc: new L.Icon({
        iconUrl: "/images/ugc-logo.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
      mk2: new L.Icon({
        iconUrl: "/images/mk2-logo.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
      independent: new L.Icon({
        iconUrl: "/images/heart-icon.png",
        iconSize: [25, 25],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      }),
    };
    return icons[type] || icons.independent;
  };

  // Icône pour la position de l'utilisateur
  const userIcon = new L.Icon({
    iconUrl: "/images/target-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -30],
  });

  return (
    <div className="map-container">
      <MapContainer
        center={[48.8566, 2.3522]} 
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {cinemas.map((cinema) => (
          <Marker
            key={cinema.id}
            position={[cinema.latitude, cinema.longitude]}
            icon={getIcon(cinema.type)}
          >
            <Popup>
              <div>
                <strong>{cinema.name}</strong><br />
                {cinema.address}
                <br />
                <button onClick={() => addToFavorites(cinema)}>
                  Ajouter aux favoris
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>
              <strong>Vous êtes ici</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
