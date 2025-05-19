import React, { useEffect, useRef, useState } from "react";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};


const SearchLocationInput = ({ setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        componentRestrictions: { country: "TH" },
      }
    );

    autoComplete.addListener("place_changed", () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateQuery(query);

    const latLng = {
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),
    };

    setSelectedLocation(latLng); // ส่งตำแหน่งที่เลือกไปยัง MapComponent
  };

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  },);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <h3 style={{ marginLeft: "20px", marginTop: "20px" }}>
        เลือกที่อยู่ส่งด่วน
      </h3>
      <div className="search-location-input" style={{ position: 'relative' }}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/search--v1.png"
          alt="Search Icon"
          style={{
            position: 'absolute',
            left: '210px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
          }}
        />
        <input   
          ref={autoCompleteRef}
          className="form-control"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาที่อยู่จัดส่งสินค้า"
          value={query}
          style={{
            paddingLeft: '30px',
            height: '30px',
            width: '1000px',
            fontSize: '14px',
            marginLeft: '200px',
            marginTop: '40px',
          }}
        />
      </div>
    </div>
  );
};

export default SearchLocationInput;
