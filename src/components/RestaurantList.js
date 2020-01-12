import React from 'react';
import { NavLink } from "react-router-dom";
import { averageStar } from '../utils.js';


export const RestaurantList = (props) => {
    return (
        <div style={{ width: "50vw", textAlign: "center" }}>
            <h2 style={{ color: "#ffffff" }}>Restaurant List</h2>
            {/* shows local restaurant list */}
            {props.filteredData.map(restaurant => (
                <div key={restaurant.lat}>
                    <NavLink
                        style={{ marginRight: "20px", color: "#ffffff", textDecoration: "none" }}
                        to={{
                            pathname: `place/?lat=${restaurant.lat}&long=${restaurant.long}`,
                            state: {
                                lat: restaurant.lat,
                                lng: restaurant.long,
                                reviews: restaurant.ratings
                            }
                        }}>
                        {restaurant.restaurantName ? restaurant.restaurantName : "Unknown"}:
                    </NavLink>
                    <span style={{ color: "#ffffff" }}>
                        {averageStar(restaurant.ratings)}
                    </span>
                </div>
            ))
            }
            {/* shows google restaurant list */}
            {props.googleFilteredData.map(restaurant => (
                <div key={restaurant.place_id}>
                    <NavLink

                        style={{ marginRight: "20px", color: "#ffffff", textDecoration: "none" }}
                        to={{
                            pathname: `place/?lat=${restaurant.geometry.location.lat()}&long=${restaurant.geometry.location.lng()}`,
                            state: {
                                lat: restaurant.geometry.location.lat(),
                                lng: restaurant.geometry.location.lng(),
                                placeId: restaurant.place_id
                            }
                        }}>
                        {restaurant.name}
                    </NavLink>
                    <span style={{ color: "#ffffff" }}>
                        {restaurant.rating}
                    </span>
                </div>
            ))
            }
        </div >
    )
}



