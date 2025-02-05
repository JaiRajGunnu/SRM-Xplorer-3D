import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE_URL, // Use the style URL from .env file
      center: [80.0457, 12.8231], // SRM University coordinates
      zoom: 17,
      pitch: 60,
      bearing: -20,
      antialias: true
    });

    map.current.on('style.load', () => {
      console.log("3D Map loaded!");

      // Add 3D buildings with the desired look
      map.current.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#5c737a", // Adjust to match the reference
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.8
        }
      });
    });

    return () => map.current.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
};

export default MapView;