import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE_URL, // Use the style URL from .env file
      center: [80.0457, 12.8231], // SRM University coordinates (Default)
      zoom: 17,
      pitch: 60,
      bearing: -20,
      antialias: true,
      attributionControl: false // Disable default attribution control
    });

    // Custom Attribution Control
    map.current.addControl(new mapboxgl.AttributionControl({
      customAttribution: 'Map design by me'
    }));

    // Navigation Control (Zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Fullscreen Control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    // Geolocate Control (Locate User)
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-left'
    );

    // Scale Control
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric' // Or 'imperial'
    });
    map.current.addControl(scale);

    // Add a Marker (example)
    const marker = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true
    }).setLngLat([80.0457, 12.8231]) // Same as center, just as an example.
      .addTo(map.current);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      console.log('Marker moved to:', lngLat);
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

    // Example Popup (added on map click)
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

      new mapboxgl.Popup({ offset: popupOffsets, className: 'my-class' })
        .setLngLat(e.lngLat)
        .setHTML("<h1>Hello World!</h1>")
        .setMaxWidth("300px")
        .addTo(map.current);
    });

    return () => map.current.remove();
  }, []);

  // Custom Control (HelloWorldControl - example)
  class HelloWorldControl {
    onAdd(map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.className = 'mapboxgl-ctrl';
      this._container.textContent = 'Hello, world';
      return this._container;
    }

    onRemove() {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }

  useEffect(() => {
    if(map.current){
      map.current.addControl(new HelloWorldControl(), 'bottom-right');
    }
  }, [map.current])

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
};

export default MapView;