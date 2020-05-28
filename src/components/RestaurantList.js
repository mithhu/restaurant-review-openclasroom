import React from "react";
import { NavLink } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { averageStar } from "../utils";

export const RestaurantList = (props) => {
  return (
    <div
      className="restaurantList"
      style={{
        textAlign: "center",
        marginBottom: "5px",
        paddingTop: "5px",
        paddingBottom: "10px",
        background: "#EFEAE5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* shows local restaurant list */}
      {props.filteredData.map((restaurant) => (
        <div
          key={restaurant.lat}
          style={{
            background: "#ffffff",
            padding: "5px 10px",
            margin: "0 auto",
            maxWidth: "fit-content",
            marginBottom: "5px",
          }}
        >
          <NavLink
            style={{
              marginRight: "20px",
              color: "black",
              textDecoration: "none",
            }}
            to={{
              pathname: `place/?lat=${restaurant.lat}&long=${restaurant.long}`,
              state: {
                lat: restaurant.lat,
                lng: restaurant.long,
                reviews: restaurant.ratings,
              },
            }}
          >
            {restaurant.restaurantName ? restaurant.restaurantName : "Unknown"}:
          </NavLink>
          <span style={{ color: "black" }}>
            {averageStar(restaurant.ratings)}
          </span>
        </div>
      ))}
      {props.googleFilteredData.map((restaurant) => (
        <div
          key={restaurant.place_id}
          style={{
            background: "#ffffff",
            padding: "5px 10px",
            margin: "5px 20px",
            flex: 1,
            marginBottom: "5px",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
          }}
        >
          <NavLink
            style={{
              color: "black",
              marginRight: "20px",
              textDecoration: "none",
              fontSize: "large",
              fontWeight: 500,
            }}
            to={{
              pathname: `place/?lat=${restaurant.geometry.location.lat()}&long=${restaurant.geometry.location.lng()}`,
              state: {
                lat: restaurant.geometry.location.lat(),
                lng: restaurant.geometry.location.lng(),
                placeId: restaurant.place_id,
              },
            }}
          >
            {`${restaurant.name}`}
          </NavLink>
          <div>
            <StarRatings
              rating={restaurant.rating}
              starRatedColor="#FFD74F"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="5px"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
