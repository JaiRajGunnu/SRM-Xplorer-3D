import React from "react";

const FloorSelector = ({ selectedFloor, setSelectedFloor }) => {
  return (
    <div className="floor-selector">
      <button onClick={() => setSelectedFloor(0)} className={selectedFloor === 0 ? "active" : ""}>Ground Floor</button>
      <button onClick={() => setSelectedFloor(1)} className={selectedFloor === 1 ? "active" : ""}>1st Floor</button>
      <button onClick={() => setSelectedFloor(2)} className={selectedFloor === 2 ? "active" : ""}>2nd Floor</button>
    </div>
  );
};

export default FloorSelector;
