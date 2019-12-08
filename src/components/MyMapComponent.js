// import React, { useState, useEffect } from 'react';
// import ReactMapGL, { Marker, Popup } from 'react-map-gl';
// import * as restaurantInfo from './restaurant.json';
// import resicon from '../images/resicon.png'
// import locationicon from '../images/location.png'

// export const MyAppComponent = () => {
//     const [viewPort, setViewPort] = useState({
//         latitude: 0,
//         longitude: 0,
//         width: "100vw",
//         height: "100vh",
//         zoom: 7
//     })

//     const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//     const [location, setLocation] = useState(null);

// useEffect(() => {
//     navigator.geolocation.getCurrentPosition(async position => {
//         const latitude = await position.coords.latitude;
//         const longitude = await position.coords.longitude;
//         setLocation({
//             ...location, latitude, longitude
//         })
//         setViewPort({
//             ...viewPort, latitude, longitude
//         })

//     })
//     console.log(viewPort)
// }, [])
//     return (
//         <div>
//             <ReactMapGL
//                 {...viewPort}
//                 mapboxApiAccessToken="pk.eyJ1IjoibWl0aGh1IiwiYSI6ImNrM3NwcmR3ejA3ZG8zb21jZWtzZ3U3bzQifQ.AOQqpCY_X7oUReTnvwdeWw"
//                 mapStyle="mapbox://styles/mithhu/ck3sqgodw1g8z1dod75kgvh1q"
//                 onViewportChange={(viewPort) => {
//                     setViewPort(viewPort)
//                 }}
//             >
//                 {location && (
//                     <Marker
//                         latitude={location.latitude}
//                         longitude={location.longitude}
//                     >
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                         }
//                         }>
//                             <img style={{ width: "20px", height: "20px" }} src={locationicon} />
//                         </button>
//                     </Marker>
//                 )
//                 }
//                 {restaurantInfo.data.map(restaurant => (
//                     <Marker
//                         latitude={restaurant.lat}
//                         longitude={restaurant.long}
//                     >
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                             setSelectedRestaurant(restaurant)
//                         }
//                         }>
//                             <img style={{ width: "20px", height: "20px" }} src={resicon} />
//                         </button>
//                     </Marker>
//                 ))}

//                 {selectedRestaurant && (
//                     <Popup latitude={selectedRestaurant.lat}
//                         longitude={selectedRestaurant.long}
//                         onClose={() => {
//                             setSelectedRestaurant(null)
//                         }}
//                     >
//                         <div>
//                             <h2> {selectedRestaurant.restaurantName}</h2>
//                             <p>{selectedRestaurant.address}</p>
//                         </div>
//                     </Popup>
//                 )}
//             </ReactMapGL>
//         </div>
//     )
// }

import React, { useState, useEffect } from "react";
import * as restaurantInfo from './restaurant.json';
// import resicon from '../images/resicon.png'
// import locationicon from '../images/location.png'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

function Map() {
  //   const [selectedPark, setSelectedPark] = useState(null);


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
  return (
    <GoogleMap
      defaultZoom={10}
      center={location === null ? { lat: 10, lng: 20 } : location}
    >
      <Marker
        position={location}
        onClick={() => console.log('bbb')}
        icon={{
          url: `/location.png`,
          scaledSize: new window.google.maps.Size(25, 25)
        }}
      />
      {restaurantInfo.data.map(restaurant => (
        <Marker
          position={{
            lat: restaurant.lat,
            lng: restaurant.long
          }}
          onClick={() => console.log('bbb')}
          icon={{
            url: `/resicon.png`,
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}
      {/* <button onClick={(e) => {
                        e.preventDefault()
                        // setSelectedRestaurant(restaurant)
                    } */}
      // }>
      {/* <img style={{ width: "20px", height: "20px" }} src={resicon} /> */}
      {/* </button> */}

      {/* </Marker> */}
      // ))}
      {/* {parkData.features.map(park => (
        <Marker
          key={park.properties.PARK_ID}
          position={{
            lat: park.geometry.coordinates[1],
            lng: park.geometry.coordinates[0]
          }}
          onClick={() => {
            setSelectedPark(park);
          }}
          icon={{
            url: `/skateboarding.svg`,
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))} */}

      {/* {selectedPark && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedPark(null);
          }}
          position={{
            lat: selectedPark.geometry.coordinates[1],
            lng: selectedPark.geometry.coordinates[0]
          }}
        >
          <div>
            <h2>{selectedPark.properties.NAME}</h2>
            <p>{selectedPark.properties.DESCRIPTIO}</p>
          </div>
        </InfoWindow>
      )} */}
    </GoogleMap>
  );
}

export const MapComponent = withScriptjs(withGoogleMap(Map));