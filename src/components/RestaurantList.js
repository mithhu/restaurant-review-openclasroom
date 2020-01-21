import React from 'react';
import { NavLink } from "react-router-dom";
import { averageStar } from '../utils.js';


export const RestaurantList = (props) => {
    return (
        <div className="restaurantList" style={{ textAlign: "center", marginBottom: "5px", paddingTop: "10px", paddingBottom: "10px", background: "#EFEAE5" }}>
            {/* shows local restaurant list */}
            {props.filteredData.map(restaurant => (
                <div key={restaurant.lat} style={{
                    background: "#ffffff", padding: "0 10px", margin: "0 auto", maxWidth: "fit-content", marginBottom: '5px'
                }}>
                    <NavLink
                        style={{ marginRight: "20px", color: "#5B5542", textDecoration: "none" }}
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
                    <span style={{ color: "#5B5542" }}>
                        {averageStar(restaurant.ratings)}
                    </span>
                </div>
            ))
            }
            {/* shows google restaurant list */}
            {props.googleFilteredData.map(restaurant => (
                <div key={restaurant.place_id} style={{
                    background: "#ffffff", padding: "0 10px", margin: "0 auto", maxWidth: "fit-content", marginBottom: '5px'
                }}>
                    <NavLink
                        style={{ color: "#5B5542", textDecoration: "none" }}
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
                    <span style={{ color: "#5B5542" }}>
                        {restaurant.rating}
                    </span>
                </div>
            ))
            }
        </div >
    )
}



