/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import ReactStreetview from 'react-streetview';
import { withRouter, Redirect, NavLink } from "react-router-dom";
import axios from 'axios';


const StreetViewComponentView = (props) => {
    // see https://developers.google.com/maps/documentation/javascript
    const googleMapsApiKey = "AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs";
    const [review, setReview] = useState("");
    let [reviewList, setReviewList] = useState(props.location.state.reviews);
    let [googleReviewList, setGoogleReviewList] = useState([]);
    const refs = useRef();

    const reviewSubmit = (event) => {
        event.preventDefault();
        if (props.location.state.reviews) {
            reviewList = [...reviewList, {
                "comment": review
            }]
            setReviewList(reviewList);
        } else {
            googleReviewList = [...googleReviewList, {
                "text": review
            }]
            setGoogleReviewList(googleReviewList);
        }
        setReview("")
    }

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
    const fetchReview = () => {
        // e.preventDefault();
        // let placeId = props.location.state.placeId ? props.location.state.placeId : placeId 
        console.log(props.location.state);
        console.log(props.location.state.placeId)
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=${props.location.state.placeId}&key=AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs`)
            // .then(response => console.log('respo', response.data.result.reviews))
            .then(response => setGoogleReviewList(response.data.result.reviews))
            .catch(err => {
                console.log(err)                     //Axios entire error message
                console.log(err.response.data.error) //Google API error message 
            })
    }
    useEffect(() => {
        if (props.location.state.placeId) {
            fetchReview()
        }
    }, [])
    return (
        <>
            <NavLink to="/">Home</NavLink>
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
                            ref={refs}

                        />) : (<Redirect to="/" />)
                    }
                </div>
                <div style={{ width: "50vw", textAlign: "center" }}>
                    <h1>Review</h1>
                    {reviewList ?
                        reviewList.map(review => (
                            <p>"{review.comment}"</p>
                        )

                        ) : undefined
                    }

                    {googleReviewList.map(review => (
                        <p>"{review.text}"</p>
                    ))
                    }
                    <form>

                        <input type="text" value={review} onChange={(event) => setReview(event.target.value)}></input>
                        <button onClick={(event) => reviewSubmit(event)}>Submit</button>
                    </form>
                </div>

            </div>
        </>
    );
}

export const StreetViewComponent = withRouter(StreetViewComponentView)

