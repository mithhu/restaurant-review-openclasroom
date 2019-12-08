import React from 'react';
import { MapComponent } from './components/MyMapComponent';
import { RestaurantList } from './components/RestaurantList';

export const Homepage = () => (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
        <MapComponent
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs`}
            // googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDIbu1WPS897YADSUKInoemwlnJvYikI9k`}
            loadingElement={<div style={{ height: `100%`, width: "50vw" }} />}
            containerElement={<div style={{ height: `100%`, width: "50vw" }} />}
            mapElement={<div style={{ height: `100%`, width: "50vw" }} />}
        />
        <RestaurantList />
    </div>
)