import React, { useState, useEffect } from "react";
import { Link, Redirect, NavLink } from "react-router-dom";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Modal from 'react-modal';
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
  const [form, setForm] = useState(false);

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
    setForm(true)
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };
  const [star, setStar] = useState(1);

  // const handleStar = (event, setStar) => {
  //   if (event.target.value < 0) {
  //     setStar(1)
  //   } else if (event.target.value > 5) {
  //     setStar(5)
  //   } else {
  //     console.log('hh')
  //     setStar(event.target.value)
  //   }
  // }

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
            <Marker
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
                  style={{ marginRight: "20px" }}
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
        <Modal
          style={customStyles}

          isOpen={form}>
          <h2>Add a restaurant</h2>
          <form>
            <div>

              <span style={{ paddingRight: "10px" }}>Restaurant name: </span><input type="text" />
            </div>
            <div>
              <span style={{ paddingRight: "10px" }}>Restaurant ratings: </span>
              <input
                type="Number"
                min="1" max="5"
                value={star}
                onChange={(event) => setStar(event.target.value)}
              />
            </div>
            <div>

              <button>Add</button>
            </div>

          </form>
        </Modal>
      </GoogleMap >
      <RestaurantList filteredData={restaurantList} />
    </div>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));