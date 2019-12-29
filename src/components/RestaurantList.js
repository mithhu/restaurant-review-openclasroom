import React, { useState } from 'react';
import * as restaurantInfo from './restaurant.json';
import { Link, Redirect, NavLink } from "react-router-dom";
import { averageStar } from '../Homepage'

export const RestaurantList = (props) => {
    return (
        <div style={{ width: "50vw", textAlign: "center" }}>
            <h2>Restaurant List</h2>
            {props.filteredData.map(restaurant => (
                <div>
                    <NavLink
                        style={{ marginRight: "20px" }}
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
                    <span>
                        {averageStar(restaurant.ratings)}
                    </span>
                </div>
            ))
            }
        </div>
    )
}
// let c = a.data.map(res => res.ratings.filter(star => star.stars < 5))
// let d = a.data.filter(d=> averageStar(d.ratings) < 4.1)


