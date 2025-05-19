import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const MapComponent = ({ selectedLocation, onConfirmLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
  });
  const mapRef = React.useRef();
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    if (selectedLocation) {
      setCurrentLocation(selectedLocation);
      if (mapRef.current) {
        mapRef.current.panTo(selectedLocation);
      }
      fetchPlaceName(selectedLocation);
    }
  }, [selectedLocation]);

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerDragEnd = async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    const newLocation = { lat: newLat, lng: newLng };
    setCurrentLocation(newLocation);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=${REACT_APP_GOOGLE_MAPS_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      setPlaceName(data.results[0].formatted_address);
    } else {
      setPlaceName("Unknown location");
    }
  };

  const fetchPlaceName = async (location) => {
    const { lat, lng } = location;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${REACT_APP_GOOGLE_MAPS_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      setPlaceName(data.results[0].formatted_address);
    } else {
      setPlaceName("Unknown location");
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(newLocation);
          fetchPlaceName(newLocation);
        },
        (error) => {
          console.error("Error fetching current location:", error);
          alert("ไม่สามารถดึงตำแหน่งปัจจุบันได้");
        }
      );
    } else {
      alert("เบราว์เซอร์ของคุณไม่รองรับ Geolocation");
    }
  };

  const handleConfirm = () => {
    onConfirmLocation({
      location: currentLocation,
      address: placeName,
    });
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Maps";

  return (
    <div>
      <div style={{ marginTop: "50px", marginBottom: "-100px" }}></div>
      <GoogleMap
        mapContainerStyle={{
          height: "400px",
        }}
        center={currentLocation}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <MarkerF
          position={currentLocation}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
        />
      </GoogleMap>
      <div className="selection-card" style={{ marginTop: "20px" }}>
        <h5>ที่อยู่ (ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)</h5>
        <div className="selection-card" style={{ marginTop: "20px" }}>
          <p>
            {placeName || "ลากหมุดเพื่อเลือกตำแหน่ง"}
            <button
              className="btn-pin"
              onClick={handleCurrentLocation}
              style={{
                marginLeft: "auto",
                width: "50px",
                height: "60px",
                backgroundColor: "white",
                color: "blue",
                border: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-40px",
              }}
            >
              <i className="fas fa-crosshairs"></i>
            </button>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleConfirm}
            disabled={!placeName}

          >
            ยืนยันตำแหน่ง
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;