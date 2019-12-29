import React, { useEffect, useState } from 'react';
import ReactStreetview from 'react-streetview';
import { withRouter, Redirect } from "react-router-dom";


const StreetViewComponentView = (props) => {
    console.log(props)
    // see https://developers.google.com/maps/documentation/javascript
    const googleMapsApiKey = "AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs";

    // see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
    let streetViewPanoramaOptions;
    if (props.location.state) {
        streetViewPanoramaOptions = {
            position: {
                lat: props.location.state.lat, lng: props.location.state.lng
            },
            pov: { heading: 100, pitch: 0 },
            zoom: 1
        };
    }
    return (
        <div style={{ display: "flex" }}>
            <div style={{
                width: '50vw',
                height: '100vh',
                backgroundColor: '#eeeeee'
            }}>
                {props.location.state ?
                    (<ReactStreetview
                        apiKey={googleMapsApiKey}
                        streetViewPanoramaOptions={streetViewPanoramaOptions}
                    />) : (<Redirect to="/" />)
                }
            </div>
            <div style={{ width: "50vw", textAlign: "center" }}>
                <h1>Review</h1>
                {props.location.state.reviews ?
                    props.location.state.reviews.map(review => (
                        <p>"{review.comment}"</p>
                    )) : undefined
                }
            </div>

        </div>
    );
}

export const StreetViewComponent = withRouter(StreetViewComponentView)

