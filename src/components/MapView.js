import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../GlassmorphismPopup.css';
import './ModalPopup.css';
import { MapContext } from './MapContext';
import placesData from '../data/campuses.json'; // Import the JSON data
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faTimes, faGlobe, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Import icons: Added faTimes + faInfoCircle

const MapView = () => {
    const { setMapInstance, mapContainer, map, flyTo, setSelectedUniversityName, selectedUniversityName } = useContext(MapContext);

    // State for Modal Popup
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [imageLoadError, setImageLoadError] = useState(false);

    //  Pre-defined places with their coordinates from JSON
    const placesRef = useRef(placesData); // Store places data in a ref


    const findNearestUniversity = useCallback((mapCenter) => {
        let nearest = null;
        let minDistance = Infinity;

        placesRef.current.forEach(place => {
            const distance = Math.sqrt(
                Math.pow(place.longitude - mapCenter.lng, 2) +
                Math.pow(place.latitude - mapCenter.lat, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = place;
            }
        });

        return nearest ? nearest.name : null;
    }, []);

    const handleInfoIconClick = () => {
        // Find the selected university data
        const selectedUniversity = placesRef.current.find(place => place.name === selectedUniversityName);

        if (selectedUniversity) {
            setModalContent(selectedUniversity); // Use existing modalContent
            setImageLoadError(false); // Reset image error state
            setShowModal(true);          // Use existing showModal
        }
    };


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
        placesRef.current.forEach(place => {
            const marker = new mapboxgl.Marker({
                color: "#ea4335", // You can change the color
            })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            //Marker click event
            const markerElement = marker.getElement();
            markerElement.addEventListener('click', () => {
                setModalContent(place); // Pass the entire place object
                setImageLoadError(false); // Reset error state when modal opens
                setShowModal(true);
                setSelectedUniversityName(place.name); // Update the university name
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


        // Update university name when the map moves
        map.current.on('moveend', () => {
            const center = map.current.getCenter();
            const nearestUniversityName = findNearestUniversity(center);
            setSelectedUniversityName(nearestUniversityName);
        });

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.off('moveend', () => {});
                map.current.remove();
            }
        };
    }, [findNearestUniversity, setSelectedUniversityName]);  // Dependencies for useEffect


    return (
        <>
            <div
                ref={mapContainer}
                style={{
                    width: '100dvw',
                    height: '91dvh',
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden'
                }}
            >
            {/* University Name Display */}
              {selectedUniversityName && (
                <div
                style={{
                  position: 'absolute',
                  top: '05px',
                  left: '05px',
                  background: 'rgba(255, 255, 255)',
                  color: '#464154',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  zIndex: 1,
                  maxWidth: '80%',
                  margin: '10px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'  // Add space between name and icon
                }}>
                  <span>{selectedUniversityName}</span>
                  <FontAwesomeIcon
                      icon={faInfoCircle}
                      style={{ cursor: 'pointer', marginLeft: '5px' }} // Adjust spacing as needed
                      onClick={handleInfoIconClick}
                  />
                </div>
              )}
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="popup-overlay">
                    <div className="modal-popup scale-down-center">
                        <div className="close-button" onClick={() => setShowModal(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>

                        {modalContent && (
                            <>
                                {/* Image Display */}
                                {modalContent.imageUrl && !imageLoadError ? (
                                    <img
                                        src={modalContent.imageUrl}
                                        alt={modalContent.name}
                                        className="modal-image"
                                        onError={() => {
                                            setImageLoadError(true); // Set error state
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/400x200?text=Image+Not+Available" // Placeholder image URL
                                        alt="Image not available"
                                        className="modal-image"
                                    />
                                )}

                                <p><b>{modalContent.name}</b></p>
                                <div className="info-line">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    </span>
                                    <span className='address'>{modalContent.address}</span>
                                </div>
                                <div className="info-line">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </span>
                                    <span> {modalContent.contactNumber}</span>
                                </div>
                                <div className="info-line">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faGlobe} />
                                    </span>
                                    <span> {modalContent.link ? (
                                      <a href={modalContent.link} target='_blank' rel="noopener noreferrer">srmist.edu.in</a>
                                    ) : (
                                      'No website available' // Or any other appropriate message
                                    )}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MapView;