// Navbar.js
import React, { useState, useContext } from 'react';
import '../Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MapContext } from './MapContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { flyTo } = useContext(MapContext); // Access flyTo from context

  // Pre-defined places with their coordinates
  const places = [
    {
      name: 'SRM Institute of Science and Technology (Main Campus - Kattankulathur, Chennai)',
      latitude: 12.8239,
      longitude: 80.0439,
    },
    {
      name: 'SRM IST Vadapalani Campus (Chennai)',
      latitude: 12.9853,
      longitude: 79.9711,
    },
    {
      name: 'SRM IST Ramapuram Campus (Chennai)',
      latitude: 13.0314,
      longitude: 80.1789,
    },
    {
      name: 'SRM University, Sonepat (Haryana)',
      latitude: 28.9931,
      longitude: 77.0151,
    },
    {
      name: 'SRM University, Sikkim (Gangtok)',
      latitude: 27.3389,
      longitude: 88.6065,
    },
    {
      name: 'SRM University, Andhra Pradesh (Amaravati)',
      latitude: 16.5062,
      longitude: 80.6480,
    },
    {
      name: 'SRM IST Ghaziabad Campus (Delhi NCR)',
      latitude: 28.6692,
      longitude: 77.4537,
    },
    {
      name: 'SRM IST Tiruchirappalli Campus (Tamil Nadu)',
      latitude: 10.8056,
      longitude: 78.6858,
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
  };

  const handleSearch = () => {
    const selectedPlace = places.find((place) => place.name === searchTerm);
    if (selectedPlace) {
      flyTo(selectedPlace.longitude, selectedPlace.latitude);
      setSuggestions([]);
    } else {
      alert('Place not found.');
    }
  };

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
      <div className="navbar-search">
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
        />
        <button className="search-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {suggestions.length > 0 && (
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