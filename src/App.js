import React from 'react';
import MapView from './components/MapView';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar /> {/* Add the Navbar component here */}
      <MapView />
    </div>
  );
};

export default App;