// Navbar.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import '../Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
      name: 'SRM IST Vadapalani Campus (Chennai)',
      latitude: 13.051908,
      longitude: 80.2091679,
    },
    {
      name: 'SRM IST Ramapuram Campus (Chennai)',
      latitude: 13.0324312,
      longitude: 80.1755446,
    },
    {
      name: 'SRM University, Sonepat (Haryana)',
      latitude: 28.9197232,
      longitude: 77.1252074,
    },
    {
      name: 'SRM University, Sikkim (Gangtok)',
      latitude: 27.3162474,
      longitude: 88.5931057,
    },
    {
      name: 'SRM University, Andhra Pradesh (Amaravati)',
      latitude: 16.4649199,
      longitude: 80.5057487,
    },
    {
      name: 'SRM IST Ghaziabad Campus (Delhi NCR)',
      latitude: 28.799357,
      longitude: 77.5360791,
    },
    {
      name: 'SRM IST Tiruchirappalli Campus (Tamil Nadu)',
      latitude: 10.9562844,
      longitude: 78.7514618,
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
    console.log("handleFocus: isActive =", isActive); // Add this line
  };

  const handleBlur = (e) => {
    // Delay blur to allow suggestion click to register
    setTimeout(() => {
      if (!searchRef.current.contains(document.activeElement)) {
        setIsActive(false);
        setSuggestions([]); // Close the suggestions
        console.log("handleBlur: isActive =", isActive); // Add this line
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
        SRM University 3D Map
      </div>
      <div
        className={`navbar-search`}
        ref={searchRef}
      >
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