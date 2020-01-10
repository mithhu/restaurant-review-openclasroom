/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
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
  const [mapService, setMapService] = useState("");
  const [star, setStar] = useState(1);
  const [googleRestaurant, setGoogleRestaurant] = useState([]);
  const [googleRestaurantView, setGoogleRestaurantView] = useState(googleRestaurant);



  const averageStar = (ratings) => {
    let totalStar = 0;
    let avgStar;
    ratings.map((rating) => {
      totalStar = totalStar + rating.stars
    })
    avgStar = totalStar / ratings.length
    return avgStar;
  }

  const refs = useRef()

  const restFilter = () => {
    let val = restaurantList.filter(restaurant => averageStar(restaurant.ratings) >= startStar && averageStar(restaurant.ratings) <= endStar)
    return val;
  }
  const googleRestFilter = (results = googleRestaurant) => {
    let val = results.filter(restaurant => restaurant.rating >= startStar && restaurant.rating <= endStar)
    console.log(val)
    return val;
  }
  const handleStar = (event) => {
    event.preventDefault();
    let newVal = restFilter()
    setRestaurantView(newVal);
    console.log(newVal)
    let newgoogleVal = googleRestFilter()
    setGoogleRestaurantView(newgoogleVal);
    console.log('google', newgoogleVal)
  }

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
    // googleRestFilter();
    fetchPlaces()
  }, [])



  const addRestaurant = async (e) => {
    e.preventDefault();
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

  const restaurantForm = (lat, lng) => {
    setModalOpen(true);
    setLat(lat);
    setLng(lng);
  }


  const fetchPlaces = () => {
    let places;
    const bounds = refs.current.getBounds();
    const service = new google.maps.places.PlacesService(refs.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
    setMapService(service);
    const request = {
      bounds: bounds,
      type: ['restaurant']
    };
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        setGoogleRestaurant(results);
        console.log('google', results);
        // while(filteredGoogle)
        let filteredGoogle = googleRestFilter(results);
        console.log(filteredGoogle)
        setGoogleRestaurantView(filteredGoogle)
      }
    })
  }


  return (
    <div>
      <form>
        <input type="Number" value={startStar} onChange={(event) => setStartStar(event.target.value)} />
        <input type="Number" value={endStar} onChange={(event) => setEndStar(event.target.value)} />
        <div>
          <button onClick={(event) => handleStar(event)}>Add</button>
        </div>
      </form>
      <GoogleMap
        defaultZoom={15}
        center={location === null ? { lat: 10, lng: 20 } : location}
        onClick={(event) => restaurantForm(event.latLng.lat(), event.latLng.lng())}
        onTilesLoaded={fetchPlaces}
        ref={refs}
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
        {googleRestaurantView &&
          googleRestaurantView.map(restaurant => (
            <Marker
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
            <InfoWindow
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
                  style={{ marginRight: "20px" }}
                  to={{
                    pathname: `place/?lat=${selectedPark.lat}&long=${selectedPark.long}`,
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
        <Modal
          style={customStyles}
          isOpen={modalOpen}
          ariaHideApp={false}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>

            <h2>Add a restaurant</h2>
            <button style={{ height: "20px", background: "red" }} onClick={() => setModalOpen(false)}> close</button>
          </div>
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
              <span style={{ paddingRight: "10px" }}>Your review: </span><input
                type="text"
                onChange={(event) => setRestaurantReview(event.target.value)}
                value={restaurantReview}
              />
            </div>
            <div>
              <span style={{ paddingRight: "10px" }}>Address : </span><input
                type="text"
                onChange={(event) => setRestaurantAddress(event.target.value)}
                value={restaurantAddress}
              />
            </div>
            <div>
              <button onClick={(event) => addRestaurant(event)}>Add</button>
            </div>

          </form>
        </Modal>
      </GoogleMap >
      <RestaurantList filteredData={restaurantView}
        googleData={googleRestaurantView}
      />
    </div>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));

//TODO: 1. inline star change 2. have a submit button for star