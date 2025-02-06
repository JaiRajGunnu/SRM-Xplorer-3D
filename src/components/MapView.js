// MapView.js
import React, { useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../GlassmorphismPopup.css';
import { MapContext } from './MapContext';

const MapView = () => {
  const { setMapInstance, mapContainer, map, flyTo } = useContext(MapContext);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE_URL,
      center: [80.0457, 12.8231],
      zoom: 17,
      pitch: 60,
      bearing: -20,
      antialias: true,
      attributionControl: false // Disable default attribution control
    });

    // Set map instance in context
    setMapInstance(map.current);

    // Initial flyTo
    flyTo(80.0457, 12.8231, 17);

    // Custom Attribution Control
    map.current.addControl(new mapboxgl.AttributionControl({
      customAttribution: 'Map design by Jai Raj Gunnu | © 2025'
    }));

    // Navigation Control
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Fullscreen Control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');

    // Geolocate Control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'bottom-left'
    );

    // Scale Control
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    });
    map.current.addControl(scale);

    // Marker (example)
    const marker = new mapboxgl.Marker({
      color: "#ea4335",
      draggable: true
    }).setLngLat([80.0457, 12.8231])
      .addTo(map.current);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      console.log('Marker moved to:', lngLat);
    });

    map.current.on('style.load', () => {
      console.log("3D Map loaded!");

      // 3D buildings
      map.current.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#5c737a",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.8
        }
      });

      // Force resize after style load
      setTimeout(() => {
        map.current.resize();
      }, 100);
    });

    // Popup on map click
    map.current.on('click', (e) => {
      const markerHeight = 50;
      const markerRadius = 10;
      const linearOffset = 25;
      const popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
      };

      new mapboxgl.Popup({ offset: popupOffsets, className: 'glassmorphism-popup' })
        .setLngLat(e.lngLat)
        .setHTML("<h4>© 2025 - Jai Raj Gunnu</h4>")
        .setMaxWidth("300px")
        .addTo(map.current);
    });

    return () => map.current.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100dvw',
        height: '93dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export default MapView;