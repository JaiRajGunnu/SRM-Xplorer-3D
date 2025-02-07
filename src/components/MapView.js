import React, { useEffect, useRef, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../GlassmorphismPopup.css';
import '../Navbar.css'; // Import CSS
import { MapContext } from './MapContext';

const MapView = () => {
    const { setMapInstance, mapContainer, map, flyTo } = useContext(MapContext);

    // State for Modal Popup
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    // Pre-defined places with their coordinates (same as in Navbar)
    const places = [
        {
            name: 'SRM Institute of Science and Technology (Main Campus - Kattankulathur, Chennai)',
            latitude: 12.8239,
            longitude: 80.0439,
        },
        {
            name: 'SRM University, Andhra Pradesh (Amaravati)',
            latitude: 16.46333,
            longitude: 80.50786,
        },
        {
            name: 'SRM IST Ramapuram Campus (Chennai)',
            latitude: 13.0329159,
            longitude: 80.1789767,
        },
        {
            name: 'SRM IST Ghaziabad Campus (Delhi NCR)',
            latitude: 28.79733,
            longitude: 77.53992,
        },
        {
            name: 'SRM University, Sonepat (Haryana)',
            latitude: 28.91827,
            longitude: 77.129926,
        },
        {
            name: 'SRM University, Sikkim (Gangtok)',
            latitude: 27.315885,
            longitude: 88.59581,
        },
        {
            name: 'SRM IST Vadapalani Campus (Chennai)',
            latitude: 13.051505,
            longitude: 80.211259,
        },
        {
            name: 'SRM IST Tiruchirappalli Campus (Tamil Nadu)',
            latitude: 10.952615,
            longitude: 78.752883,
        },
    ];

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: process.env.REACT_APP_MAPBOX_STYLE_URL,
            center: [80.0439, 12.8239],
            zoom: 17,
            pitch: 70,
            bearing: -25,
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

        // Navigation Control (Zoom buttons) - Move to top-right
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Fullscreen Control - Bottom right
        map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

        // Scale Control
        const scale = new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
        });
        map.current.addControl(scale);


        // Add markers for each place
        places.forEach(place => {
            const marker = new mapboxgl.Marker({
                color: "#ea4335", // You can change the color
            })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            //Marker click event
            marker.getElement().addEventListener('click', () => {
                setModalContent(place.name);
                setShowModal(true);
            });
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
        <>
            <div
                ref={mapContainer}
                style={{
                    width: '100dvw',
                    height: '92dvh',
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden'
                }}
            />

            {/* Modal Popup */}
            {showModal && (
                <div className="popup-overlay">
                    <div className="modal-popup scale-down-center">
                        <p>{modalContent}</p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MapView;