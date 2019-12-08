import React, { useEffect, useState } from 'react';
import ReactStreetview from 'react-streetview';

export const StreetViewComponent = (props) => {
    const [location, setLocation] = useState({
        lat: 10, lng: 17.8951832
    })
    const getLocation = () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let lat = parseFloat(url.searchParams.get("lat"));
        console.log(lat)
        let long = parseFloat(url.searchParams.get("long"));
        console.log(lat, long);
        setLocation({
            ...location,
            lat: lat, lng: long
        })

        console.log(location)
        // return location
    }
    // see https://developers.google.com/maps/documentation/javascript
    const googleMapsApiKey = "AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs";

    // see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
    const streetViewPanoramaOptions = {
        position: { lat: location.lat, lng: location.lng },
        pov: { heading: 100, pitch: 0 },
        zoom: 1
    };

    useEffect(() => {
        getLocation();
        // console.log(loc)

        // console.log(`nfj, ${location}`)
    }, [])

    return (
        <div style={{
            width: '800px',
            height: '450px',
            backgroundColor: '#eeeeee'
        }}>
            <ReactStreetview
                apiKey={googleMapsApiKey}
                streetViewPanoramaOptions={streetViewPanoramaOptions}
            />
        </div>
    );
}

