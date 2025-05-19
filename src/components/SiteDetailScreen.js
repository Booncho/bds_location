import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";
import "../styles/SiteDetailScreen.css";
const SiteDetailScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
  
    const {
      lat,
      lng,
      siteName,
      siteAddress,
      siteTel,
      distance,
      openingHours,
      originLat,
      originLng,
    } = state || {};
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    });
  
    if (loadError) return <p>Error loading map</p>;
    if (!isLoaded) return <p>Loading map...</p>;
  
    const handleNavigate = () => {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${lat},${lng}&travelmode=driving`
      );
    };
  
    return (
      <div className="site-detail-container">
        <button onClick={() => navigate(-1)} className="back-button" style={{ color: "blue", backgroundColor: "#f7fafd", fontSize: "20px" }}>
        <i className="fa fa-angle-left	"></i> 
      </button>
        <h3 className="site-header">{siteName}</h3>
        <div className="site-address-box">
          <h4>ที่อยู่</h4>
          <hr className="divider" />
          <p>{siteAddress}</p>
        </div>
        <div className="site-map">
          <GoogleMap
            mapContainerStyle={{
              height: "400px",
              width: "100%",
            }}
            center={{ lat, lng }}
            zoom={15}
          >
            <MarkerF position={{ lat, lng }} />
          </GoogleMap>
        </div>
  
        <div className="site-info-card">
          <h4>{siteName}</h4>
          <p>
            <span className="label">สาขา:</span>{" "}
            <span className="value">{siteAddress}</span>
          </p>
          <p>
            <span className="label">ระยะทางในรัศมี:</span>{" "}
            <span className="value">{distance} km</span>
          </p>
          <p>
            <span className="label">เวลาเปิดปิดร้าน:</span>{" "}
            <span className="value">{openingHours}</span>
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleNavigate} className="btn-navigate">
              นำทาง
            </button>
            <button onClick={() => window.open(`tel:${siteTel}`)} className="btn-call">
              โทร {siteTel}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SiteDetailScreen;