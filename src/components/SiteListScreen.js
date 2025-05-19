import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import siteList from "../data/site-list.json";
import "../styles/SiteListScreen.css";

const SiteListScreen = ({ currentLocation, onBack }) => {
  const [sites, setSites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSites(siteList);
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isStoreOpen = (openTime, closeTime) => {
    if (openTime === "00:00" && closeTime === "00:00") {
      // เปิด 24 ชั่วโมง
      return true;
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const currentTime = formatter.format(now); // เวลาปัจจุบันในรูปแบบ HH:mm

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const filteredSites = sites
    .filter((site) =>
      site.site_desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((site) => site.location.coordinates[0] !== 0 && site.location.coordinates[1] !== 0)
    .map((site) => ({
      ...site,
      distance: calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        site.location.coordinates[1],
        site.location.coordinates[0]
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div>
      <button onClick={onBack} className="btn btn-secondary" style={{ color: "blue", backgroundColor: "#f7fafd", fontSize: "20px" }}>
        <i className="fa fa-angle-left	"></i> 
      </button>
      <h3><b>ค้นหาสาขา</b></h3>
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <input
          type="text"
          placeholder="🔍 ค้นหาสาขา"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
          style={{
            marginBottom: "20px",
            padding: "10px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "400px",
          }}
        />
      </div>
      <ul>
        {filteredSites.map((site) => {
          const openTime = site.site_open_time.slice(0, -3);
          const closeTime = site.site_close_time.slice(0, -3);
          const isOpen = isStoreOpen(openTime, closeTime);

          return (
            <li key={site.site_id}>
              <h4>{site.site_desc}</h4>
              <p>
                <span className="label">สาขา:</span>{" "}
                <span className="value">{site.site_address}</span>
              </p>
              <p>
                <span className="label">ระยะทางในรัศมี:</span>{" "}
                <span className="value">{site.distance.toFixed(2)} กม.</span>
              </p>
              <p>
                <span className="label">เวลาเปิดปิดร้าน:</span>{" "}
                <span className="value">
                  {!isOpen && openTime !== "00:00" && closeTime !== "00:00" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>ปิด </span>
                  )}
                  {openTime} - {closeTime}
                </span>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => window.open(`tel:${site.site_tel}`)}
                  className="btn btn-primary"
                >
                  Call {site.site_tel}
                </button>
                <button
                  onClick={() =>
                    navigate("/site-detail", {
                      state: {
                        lat: site.location.coordinates[1],
                        lng: site.location.coordinates[0],
                        siteName: site.site_desc,
                        siteAddress: site.site_address,
                        siteTel: site.site_tel,
                        distance: site.distance.toFixed(2),
                        openingHours: `${openTime} - ${closeTime}`,
                        originLat: currentLocation.lat,
                        originLng: currentLocation.lng,
                      },
                    })
                  }
                  className="btn btn-primary" style={{ backgroundColor: "#0084ff", color: "#fff" }}
                >
                  แผนที่สาขา
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SiteListScreen;