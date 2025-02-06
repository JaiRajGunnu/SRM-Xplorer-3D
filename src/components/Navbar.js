// Navbar.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import '../Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import map marker icon
import { MapContext } from './MapContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { flyTo } = useContext(MapContext); // Access flyTo from context
  const [isActive, setIsActive] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null); // Ref to the input element

  // Pre-defined places with their coordinates
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

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter places based on the search term
    const filteredSuggestions = places.filter((place) =>
      place.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (place) => {
    setSearchTerm(place.name);
    setSuggestions([]); // Clear suggestions
    flyTo(place.longitude, place.latitude); // Fly to the selected place
    setIsActive(false); // remove active style
  };

  const handleSearch = () => {
    const selectedPlace = places.find((place) => place.name === searchTerm);
    if (selectedPlace) {
      flyTo(selectedPlace.longitude, selectedPlace.latitude);
      setSuggestions([]);
      setIsActive(false); // remove active style
    } else {
      alert('Place not found.');
    }
  };

  const handleFocus = () => {
    setIsActive(true);
    handleSearchChange({ target: { value: "" } }); // Trigger with empty string
  };

  const handleBlur = (e) => {
    // Delay blur to allow suggestion click to register
    setTimeout(() => {
      if (!searchRef.current.contains(document.activeElement)) {
        setIsActive(false);
        setSuggestions([]); // Close the suggestions
      }
    }, 100); // Adjust delay as needed
  };

  useEffect(() => {
    if (isActive) {
      searchRef.current.classList.add('active');
    } else {
      searchRef.current.classList.remove('active');
    }
  }, [isActive]);


  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png"
          alt="SRM Logo"
          className="navbar-logo"
        />
        <span className='navbar-head'>SRM Xplorer 3D</span>
      </div>
      <div
        className={`navbar-search`}
        ref={searchRef}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} className="search-marker-icon" />  {/* Add the map marker icon here */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
        />
        <button className="search-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {isActive && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((place) => (
              <li key={place.name} onClick={() => handleSuggestionClick(place)}>
                {place.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;