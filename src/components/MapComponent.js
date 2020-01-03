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

  const handleStar = (event) => {
    event.preventDefault();
    let newVal = restFilter()
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
    console.log('new', refs)

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
    setRestaurantName("");
    setStar("");
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

  const fetchPlaces = () => {
    // let map = new window.google.maps.Map(refs.current, {
    //   center: location,
    //   zoom: 14,
    //   mapTypeId: "roadmap"
    // });
    // console.log(map);
    // console.log(this.refs)

    // let service = new window.google.maps.places.PlacesService(map);
    // service.getDetails(
    //   { placeId: "ChIJwRGj6NnAVTcRfnB5LY-hhco" },
    //   (place, status) => {
    //     // const latLng = String(place.geometry.location)
    //     //   .replace(" ", "")
    //     //   .replace("(", "")
    //     //   .replace(")", "")
    //     //   .split(",");
    //     console.log(place);
    //     // this.setState({
    //     //   location: latLng,
    //     //   place,
    //     //   reviews: place.reviews
    //     // });
    //   }
    // );
    // console.log(refs)
    let places;
    const bounds = refs.current.getBounds();
    const service = new google.maps.places.PlacesService(refs.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
    const request = {
      bounds: bounds,
      type: ['restaurant']
    };
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        // updatePlaces(results);
      }
    })

    // var request = {
    //   location: Location,
    //   radius: '500',
    //   query: 'restaurant'
    // };

    // let map = new window.google.maps.Map(refs.map, {
    //   center: location,
    //   zoom: 14,
    //   mapTypeId: "roadmap"
    // });
    // console.log('new', refs)

    // let service = new google.maps.places.PlacesService(location);
    // let service = map.getBounds();
    // console.log(service)
    // service.textSearch(request, callback);
    // let places;
    // const bounds = refs.map.getBounds();
    // const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
    // const request = {
    //     bounds: bounds,
    //     type: ['hotel']
    // };
    // service.nearbySearch(request, (results, status) => {
    //     if (status == google.maps.places.PlacesServiceStatus.OK) {
    //         console.log(results);
    //         updatePlaces(results);
    //     }
    // })
  }

  // function callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       var place = results[i];
  //       createMarker(results[i]);
  //     }
  //   }
  // }
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
      // ref={props.onMapLoad}
      // onMapLoad={}
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