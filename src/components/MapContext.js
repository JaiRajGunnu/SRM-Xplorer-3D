import React, { createContext, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedUniversityName, setSelectedUniversityName] = useState(null); // New state

  const flyTo = (lng, lat, zoom) => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: zoom || 17,
        essential: true // Animation: This animation parameter makes the map fly to the centre of the screen
      });
    }
  };

  const contextValue = {
    mapInstance,
    setMapInstance,
    mapContainer,
    map,
    flyTo,
    selectedUniversityName, // Include the name
    setSelectedUniversityName // Include the setter
  };

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};