import React from "react";
import { MapComponent } from "./components/MapComponent";

export const Homepage = () => {
  return (
    <>
      <div
        className="home"
        style={{ width: "100vw", height: "100vh", background: "#EFEAE5" }}
      >
        <MapComponent
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          // loadingElement, which is getting rendered until Google Maps library is finished loading
          containerElement={
            <div className="containerElement" style={{ height: `100%` }} />
          }
          //containerlement is going to hold our map element
          mapElement={<div className="mapElement" />}
        />
      </div>
    </>
  );
};
