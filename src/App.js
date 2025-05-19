import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import MapComponent from "./components/Map";
import SearchLocationInput from "./components/GooglePlcasesApi";
import SiteListScreen from "./components/SiteListScreen";
import SiteDetailScreen from "./components/SiteDetailScreen"; // Import SiteDetailScreen

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [savedLocation, setSavedLocation] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("map");

  const handleConfirmLocation = (data) => {
    setSavedLocation(data);
    setCurrentScreen("siteList");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            currentScreen === "map" ? (
              <div>
                <SearchLocationInput setSelectedLocation={setSelectedLocation} />
                <MapComponent
                  selectedLocation={selectedLocation}
                  onConfirmLocation={handleConfirmLocation}
                />
              </div>
            ) : (
              <SiteListScreen
                currentLocation={savedLocation?.location}
                onBack={() => setCurrentScreen("map")}
              />
            )
          }
        />
        <Route path="/site-detail" element={<SiteDetailScreen />} />
      </Routes>
    </Router>
  );
};

export default App;