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
    // const [startStar, setStartStar] = useState(1);
    // const [endStar, setEndStar] = useState(5);

    // const handleStar = (event, setStar) => {
    //     if (!event.target.value) {
    //         setStar(1)
    //     }
    //     else if (event.target.value < 1) {
    //         setStar(1)
    //     } else if (event.target.value > 5) {
    //         setStar(5)
    //     } else {
    //         setStar(event.target.value)
    //     }
    // }

    // let filteredData = restaurantInfo.data.filter(restaurant => averageStar(restaurant.ratings) >= startStar && averageStar(restaurant.ratings) <= endStar)

    return (
        <>
            {/* <div>
                <input type="Number" value={startStar} onChange={(event) => handleStar(event, setStartStar)} />
                <input type="Number" value={endStar} onChange={(event) => handleStar(event, setEndStar)} />

            </div> */}
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