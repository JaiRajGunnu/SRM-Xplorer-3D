
import './App.css';

// App.js (or similar)
import React from 'react';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import { MapProvider } from './components/MapContext';

function App() {
  return (
    <MapProvider>
      <div>
        <Navbar />
        <MapView />
      </div>
    </MapProvider>
  );
}

export default App;
