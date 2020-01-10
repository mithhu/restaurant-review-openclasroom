import React, { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { RestaurantList } from './components/RestaurantList';
import * as restaurantInfo from './components/restaurant.json';

export const averageStar = (ratings) => {
    let totalStar = 0;
    let avgStar;
    ratings.map((rating) => {
        totalStar = totalStar + rating.stars
    })
    avgStar = totalStar / ratings.length
    return avgStar;
}


export const Homepage = () => {
    // let filteredData = restaurantInfo.data.filter(restaurant => averageStar(restaurant.ratings) >= startStar && averageStar(restaurant.ratings) <= endStar)
    return (
        <>
            <div style={{ width: "100vw", height: "100vh" }}>
                <MapComponent
                    // filteredData={filteredData}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs`}
                    // googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDIbu1WPS897YADSUKInoemwlnJvYikI9k`}
                    loadingElement={<div style={{ height: `100%`, width: "50vw" }} />}
                    containerElement={<div style={{ height: `100%`, width: "50vw", display: "-webkit-box" }} />}
                    mapElement={<div style={{ height: `100%`, width: "50vw" }} />}
                />
            </div>
        </>
    )
}