import React, { useState } from 'react';
import * as restaurantInfo from './restaurant.json';
import { Link, Redirect, NavLink } from "react-router-dom";


export const RestaurantList = () => {
    const averageStar = (ratings) => {
        let totalStar = 0;
        let avgStar;
        ratings.map((rating) => {
            totalStar = totalStar + rating.stars
        })
        avgStar = totalStar / ratings.length
        return avgStar;
    }
    return (
        <div style={{ width: "50vw", textAlign: "center" }}>
            <h2>Restaurant List</h2>
            {restaurantInfo.data.map(restaurant => (
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
                            // component=
                        }}>
                        {restaurant.restaurantName}:
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