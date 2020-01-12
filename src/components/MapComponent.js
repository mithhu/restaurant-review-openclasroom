/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import * as restaurantInfo from '../restaurant.json';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Modal from 'react-modal';
import { RestaurantList } from "./RestaurantList.js";
import { averageStar } from "../utils.js";

const Map = () => {
  const [startRating, setStartRating] = useState(1);
  const [endRating, setEndRating] = useState(5);
  const [location, setLocation] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [restaurantReview, setRestaurantReview] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  let filteredData = restaurantInfo.data;
  const [restaurantName, setRestaurantName] = useState("");
  let [restaurantList, setRestaurantList] = useState(filteredData);
  let [restaurantView, setRestaurantView] = useState(filteredData);
  const [star, setStar] = useState(1);
  const [googleRestaurant, setGoogleRestaurant] = useState([]);
  const [googleRestaurantView, setGoogleRestaurantView] = useState(googleRestaurant);
  const refs = useRef()
  const [errorAddRestaurant, setErrorAddRestaurant] = useState("");
  const [errorRating, setErrorRating] = useState("");

  //Filters out local restaurants using ratings
  const restFilter = () => {
    let val = restaurantList.filter(restaurant => averageStar(restaurant.ratings) >= startRating && averageStar(restaurant.ratings) <= endRating)
    return val;
  }
  //Filters out google restaurants using ratings
  const googleRestFilter = (results = googleRestaurant) => {
    let val = results.filter(restaurant => restaurant.rating >= startRating && restaurant.rating <= endRating)
    return val;
  }
  //Changes the view of the map accoding to ratings
  const handleRatings = (event) => {
    event.preventDefault();
    setErrorRating("")
    if (!startRating) {
      setErrorRating("Please add start rating")
    } else if (!endRating) {
      setErrorRating("Please add end rating")
    } else if (startRating < 1 || startRating > 4) {
      setErrorRating("Start rating must be between 1 to 4")
    } else if (endRating <= startRating) {
      setErrorRating("End rating can't be same or less than start rating")
    } else if (endRating < 1.1 || endRating > 5) {
      setErrorRating("End rating must be between 1.1 to 5")
    } else {
      let newVal = restFilter()
      setRestaurantView(newVal);
      let newgoogleVal = googleRestFilter()
      setGoogleRestaurantView(newgoogleVal);
    }
  }

  //Gets the current latitude and longitude using gelocation api
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async position => {
      let lat = await position.coords.latitude;
      let lng = await position.coords.longitude;
      setLocation({
        ...location, lat, lng
      })
    })
  }

  //Runs when dom renders. Used it to get location and nearest restaurants when when page loads at first 
  useEffect(() => {
    getLocation();
    fetchPlaces()
  }, [])

  //To add restaurant both on the map and restaurant list
  const addRestaurant = async (e) => {
    e.preventDefault();
    setErrorAddRestaurant("");
    if (!restaurantName) {
      setErrorAddRestaurant("Please add restaurant name")
    }
    else if (!star) {
      setErrorAddRestaurant("Please add restaurant rating")
    }
    else if (star < 1 || star > 5) {
      setErrorAddRestaurant("Rating must be between 1 to 5")
    } else {
      restaurantList = [...restaurantList, {
        lat: lat, long: lng, address: restaurantAddress, restaurantName: restaurantName, "ratings": [
          {
            "stars": star,
            "comment": restaurantReview
          }]
      }]
      setRestaurantList(restaurantList);
      let newVal = await restFilter()
      setRestaurantView(newVal);
      setModalOpen(false)
      setRestaurantName("");
      setStar("");
      setRestaurantReview("");
    }
  }

  //Used this for Modal that runs when addRestaurant function works  
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

  //Gets the latitude and longitude when we click on any parts of the map
  const restaurantForm = (lat, lng) => {
    setModalOpen(true);
    setLat(lat);
    setLng(lng);
  }

  //Fetch nearest places using Google PlacesService api
  const fetchPlaces = () => {
    const bounds = refs.current.getBounds(); //gets the visible area of the google map
    const service = new google.maps.places.PlacesService(refs.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
    const request = {
      bounds: bounds,
      type: ['restaurant'],
      location: refs.current.props.center,
      radius: 10000
    };
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setGoogleRestaurant(results);
        let filteredGoogle = googleRestFilter(results);
        setGoogleRestaurantView(filteredGoogle)
      }
    })
  }


  return (
    <div>
      <div
        style={{
          textAlign: "center",
          paddingTop: errorRating ? "0px" : "20px"
        }}
      >
        <p style={{ color: "red" }}>{errorRating ? errorRating : undefined}</p>
        <form>
          <div>
            <span style={{ color: "#ffffff" }}> Restaurant start rating: </span>
            <input
              type="Number"
              value={startRating}
              onChange={(event) => setStartRating(event.target.value)}
              min="1" max="4"
            />
          </div>
          <div>
            <span style={{ color: "#ffffff" }}> Restaurant end rating: </span>
            <input
              type="Number"
              value={endRating}
              onChange={(event) => setEndRating(event.target.value)}
              min="2" max="5"
            />
          </div>
          <button style={{ marginTop: "20px", background: '#B2D9FB', cursor: "pointer" }} onClick={(event) => handleRatings(event)}>Show Restaurants</button>
        </form>
      </div>
      <GoogleMap
        defaultZoom={15}
        center={location === null ? { lat: 10, lng: 20 } : location}
        onClick={(event) => restaurantForm(event.latLng.lat(), event.latLng.lng())}
        onTilesLoaded={fetchPlaces} //runs when the map loads or changes
        ref={refs}
      >
        <Marker //Adds a marker on the google map using latitude and longitude
          position={location}
        />
        {
          restaurantView.map(restaurant => (
            <Marker
              key={restaurant.lat}
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
        {googleRestaurantView &&
          googleRestaurantView.map(restaurant => (
            <Marker
              key={restaurant.place_id}
              position={{
                lat: restaurant.geometry.location.lat(),
                lng: restaurant.geometry.location.lng()
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
            <InfoWindow //Shows info about a place(restaurant) when a marker is being clicked
              onCloseClick={() => {
                setSelectedPark(null);
              }}
              position={{
                lat: selectedPark.lat ? selectedPark.lat : selectedPark.geometry.location.lat(),
                lng: selectedPark.long ? selectedPark.long : selectedPark.geometry.location.lng(),
              }}
            >
              <div>
                <h2>{selectedPark.restaurantName ? selectedPark.restaurantName : selectedPark.name}</h2>
                <p>{selectedPark.address ? selectedPark.address : selectedPark.vicinity}</p>
                <NavLink
                  style={{ marginRight: "20px", textDecoration: "none" }}
                  to={{
                    pathname: `place/?lat=${selectedPark.lat ? selectedPark.lat : selectedPark.geometry.location.lat()}&long=${selectedPark.long ? selectedPark.long : selectedPark.geometry.location.lng()}`,
                    state: {
                      lat: selectedPark.lat ? selectedPark.lat : selectedPark.geometry.location.lat(),
                      lng: selectedPark.long ? selectedPark.long : selectedPark.geometry.location.lng(),
                      reviews: selectedPark.ratings ? selectedPark.ratings : undefined,
                      placeId: selectedPark.place_id ? selectedPark.place_id : undefined,
                    }
                  }}>
                  Show on the map:
                    </NavLink>
              </div>
            </InfoWindow>
          )
        }
        <Modal //A modal to show the form form for adding restaurants
          style={customStyles}
          isOpen={modalOpen}
          ariaHideApp={false}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Add a restaurant</h2>
            <button style={{ height: "20px", background: '#B2D9FB', cursor: "pointer" }}
              onClick={() => {
                setModalOpen(false)
                setErrorAddRestaurant("")
              }
              }> close</button>
          </div>
          <p style={{ color: "red" }}>{errorAddRestaurant ? errorAddRestaurant : undefined}</p>
          <form>
            <div>
              <span style={{ paddingRight: "10px" }}>Restaurant name: </span>
              <input
                style={{ border: '2px solid #B2D9FB' }}
                type="text"
                onChange={(event) => setRestaurantName(event.target.value)}
                value={restaurantName}
              />
            </div>
            <div>
              <span style={{ paddingRight: "10px" }}>Restaurant ratings: </span>
              <input
                style={{ border: '2px solid #B2D9FB' }}
                type="Number"
                min="1" max="5"
                value={star}
                onChange={(event) => setStar(event.target.value)}
              />
            </div>
            <div>
              <span style={{ paddingRight: "10px" }}>Your review: </span>
              <input
                style={{ border: '2px solid #B2D9FB' }}
                type="text"
                onChange={(event) => setRestaurantReview(event.target.value)}
                value={restaurantReview}
              />
            </div>
            <div>
              <span style={{ paddingRight: "10px" }}>Address : </span>
              <input
                style={{ border: '2px solid #B2D9FB' }}
                type="text"
                onChange={(event) => setRestaurantAddress(event.target.value)}
                value={restaurantAddress}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button style={{ background: '#B2D9FB', cursor: "pointer" }} onClick={(event) => addRestaurant(event)}>Add Restaurant</button>
            </div>
          </form>
        </Modal>
      </GoogleMap >
      <RestaurantList //A component to show restaurant list on the right side of homepage
        filteredData={restaurantView} //sending local restaurant data
        googleFilteredData={googleRestaurantView} //sending Google's restaurant data
      />
    </div>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));
// withGoogleMap initializes the Map component,
// and withScriptjs is what loads the Google Maps Javascript API v3.