import React, { useState } from 'react';
import '../Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // You would typically implement search functionality here,
    // such as filtering data or making an API request.
    console.log('Search term:', event.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">SRM University 3D Map</div>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;