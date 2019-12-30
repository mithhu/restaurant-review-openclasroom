import React, { useState, useEffect } from "react";
import { Link, Redirect, NavLink } from "react-router-dom";
import * as restaurantInfo from '../components/restaurant.json';

import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Modal from 'react-modal';
import { RestaurantList } from "./RestaurantList.js";

const Map = (props) => {
  const [startStar, setStartStar] = useState(1);
  const [endStar, setEndStar] = useState(5);
  const averageStar = (ratings) => {
    let totalStar = 0;
    let avgStar;
    ratings.map((rating) => {
      totalStar = totalStar + rating.stars
    })
    avgStar = totalStar / ratings.length
    return avgStar;
  }

  const restFilter = () => {
    let val = restaurantList.filter(restaurant => averageStar(restaurant.ratings) >= startStar && averageStar(restaurant.ratings) <= endStar)
    return val;
  }

  const handleStar = async (event, setStar) => {
    // if (!event.target.value) {
    //     setStar(1)
    // }
    // else if (event.target.value < 1) {
    //     setStar(1)
    // } else if (event.target.value > 5) {
    //     setStar(5)
    // } else {
    setStar(event.target.value)
    console.log(restaurantList)
    // }
    let newVal = await restFilter()
    setRestaurantView(newVal);
    console.log(newVal)
  }

  let filteredData = restaurantInfo.data;
  // .filter(restaurant => averageStar(restaurant.ratings) >= startStar && averageStar(restaurant.ratings) <= endStar)

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

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [restaurantName, setRestaurantName] = useState("");
  let [restaurantList, setRestaurantList] = useState(filteredData);
  let [restaurantView, setRestaurantView] = useState(filteredData);

  const addRestaurant = async (e) => {
    e.preventDefault();
    restaurantList = [...restaurantList, {
      lat: lat, long: lng, restaurantName: restaurantName, "ratings": [
        {
          "stars": star,
          "comment": "Great Place!"
        }]
    }]
    setRestaurantList(restaurantList);
    let newVal = await restFilter()
    setRestaurantView(newVal);
    setForm(false)
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
  const restaurantForm = (lat, lng) => {
    // e.preventDefault();
    setForm(true);
    setLat(lat);
    setLng(lng);
  }

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
      <div>
        <input type="Number" value={startStar} onChange={(event) => handleStar(event, setStartStar)} />
        <input type="Number" value={endStar} onChange={(event) => handleStar(event, setEndStar)} />

      </div>
      <GoogleMap
        defaultZoom={15}
        center={location === null ? { lat: 10, lng: 20 } : location}
        onClick={(event) => restaurantForm(event.latLng.lat(), event.latLng.lng())}
      >
        <Marker
          position={location}
        />

        {
          restaurantView.map(restaurant => (
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

              <span style={{ paddingRight: "10px" }}>Restaurant name: </span><input
                type="text"
                onChange={(event) => setRestaurantName(event.target.value)}
                value={restaurantName}
              />
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

              <button onClick={(event) => addRestaurant(event)}>Add</button>
            </div>

          </form>
        </Modal>
      </GoogleMap >
      <RestaurantList filteredData={restaurantView} />
    </div>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));

//TODO: 1. inline star change 2. have a submit button for star