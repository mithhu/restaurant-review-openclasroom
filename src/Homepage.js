import React from 'react';
import { MapComponent } from './components/MapComponent';
import { api_key } from './utils';

export const Homepage = () => {
    return (
        <>
            <div style={{ width: "100vw", height: "100vh", background: "#0C041C" }}>
                <MapComponent
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${api_key}`}
                    loadingElement={<div style={{ height: `100%`, width: "50vw" }} />}
                    // loadingElement, which is getting rendered until Google Maps library is finished loading
                    containerElement={<div style={{ height: `100%`, width: "50vw", display: "-webkit-box" }} />}
                    //containerlement is going to hold our map element
                    mapElement={<div style={{ height: `100%`, width: "50vw" }} />}
                />
            </div>
        </>
    )
}