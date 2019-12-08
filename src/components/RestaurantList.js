import React, { useState } from 'react';
import * as restaurantInfo from './restaurant.json';
import { StreetViewComponent } from './StreetViewComponent.js';
import { Link } from "react-router-dom";

export const RestaurantList = () => {
    // const [showStreet, setShowStreet] = useState(false);
    return (
        restaurantInfo.data.map(restaurant => (
            <div>
                <Link
                    to={`location/?lat=${restaurant.lat}&long=${restaurant.long}`}>
                    {/* // onClick={() => setShowStreet(true)}> */}
                    <h2>
                        {restaurant.restaurantName}
                    </h2>
                </Link>
                <p>{restaurant.ratings[0].stars}</p>
                {/* {showStreet && (
                    <StreetViewComponent
                        lat={restaurant.lat} long={restaurant.long} />
                )} */}

            </div>
        ))

    )
}