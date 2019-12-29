import React, { useState, useEffect } from "react";
import { Link, Redirect, NavLink } from "react-router-dom";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import { RestaurantList } from "./RestaurantList.js";

function Map(props) {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async position => {
      let lat = await position.coords.latitude;
      let lng = await position.coords.longitude;
      setLocation({
        ...location, lat, lng
      })
    })
  }

  useEffect(() => {
    getLocation();
  }, [])

  const [location, setLocation] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);

  let [restaurantList, setRestaurantList] = useState(props.filteredData);
  const addRestaurant = (lat, lng) => {
    restaurantList = [...restaurantList, {
      lat: lat, long: lng, "ratings": [
        {
          "stars": 4,
          "comment": "Great Place!"
        }]
    }]
    setRestaurantList(restaurantList);
  }

  return (
    <div>
      <GoogleMap
        defaultZoom={15}
        center={location === null ? { lat: 10, lng: 20 } : location}
        onClick={(event) => addRestaurant(event.latLng.lat(), event.latLng.lng())}
      >
        <Marker
          position={location}
        />

        {
          restaurantList.map(restaurant => (
            < Marker
              position={{
                lat: restaurant.lat,
                lng: restaurant.long
              }}
              onClick={() => setSelectedPark(restaurant)}
              icon={{
                url: `/resicon.png`,
                scaledSize: new window.google.maps.Size(25, 25)
              }}
            />
          ))
        }
        {
          selectedPark && (
            <InfoWindow
              onCloseClick={() => {
                setSelectedPark(null);
              }}
              position={{
                lat: selectedPark.lat,
                lng: selectedPark.long
              }}
            >
              <div>
                <h2>{selectedPark.restaurantName}</h2>
                <p>{selectedPark.address}</p>
                <NavLink
                  // style={{ marginRight: "20px" }}
                  to={{
                    pathname: `place/?lat=${selectedPark.lat}&long=${selectedPark.long}`,
                    state: {
                      lat: selectedPark.lat,
                      lng: selectedPark.long,
                      reviews: selectedPark.ratings ? selectedPark.ratings : undefined
                    }
                  }}>
                  Show on the map:
                    </NavLink>
              </div>
            </InfoWindow>
          )
        }
      </GoogleMap >
      <RestaurantList filteredData={restaurantList} />
    </div>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));