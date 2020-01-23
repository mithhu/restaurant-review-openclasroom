/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from 'react';
import ReactStreetview from 'react-streetview';
import { withRouter, Redirect, NavLink } from "react-router-dom";
import axios from 'axios';
import { api_key } from '../utils';

const StreetViewComponentView = (props) => {
    const googleMapsApiKey = "AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs";
    const [review, setReview] = useState("");
    let [reviewList, setReviewList] = useState(props.location.state.reviews);
    let [googleReviewList, setGoogleReviewList] = useState([]);
    const refs = useRef();

    //to submit a restaurant review 
    const reviewSubmit = (event) => {
        event.preventDefault();
        //adds local restaurant review
        if (props.location.state.reviews) {
            reviewList = [...reviewList, {
                "comment": review
            }]
            setReviewList(reviewList);
            console.log(reviewList)
        } else {
            //adds Google restaurant review
            googleReviewList = [...googleReviewList, {
                "text": review
            }]
            setGoogleReviewList(googleReviewList);
        }
        setReview("")
    }

    //settings for strretview map
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
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=${props.location.state.placeId}&key=${api_key}`)
            .then(response => setGoogleReviewList(response.data.result.reviews))
            .catch(err => {
                console.log(err)                     //Axios entire error message
                console.log(err.response.data.error) //Google API error message 
            })
    }
    //fetch reviews when the pagge loads or compnent renders
    useEffect(() => {
        if (props.location.state.placeId) {
            fetchReview()
        }
    }, [])
    return (
        <div className="routeLink" style={{ background: "#EFEAE5" }} >
            <NavLink className="route" style={{ textDecoration: "none", color: "#5B5542" }} to="/">Back to Home</NavLink>
            <div className="streetView">
                <div className="streetViewStyle" style={{
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
                {/* shows the review list */}
                <div className="reviewList" style={{ textAlign: "center", marginTop: "20px", paddingBottom: "20px", background: "#EFEAE5" }}>
                    <h1 style={{ color: "#5B5542" }}>Review</h1>
                    {reviewList ? reviewList.map(review => (
                        <div style={{
                            background: "#ffffff", padding: "0 10px", margin: "0 auto", maxWidth: "fit-content"
                        }}>
                            <p style={{ color: "black", margin: "5px 0", padding: "5px" }}>{review.comment ? review.comment : undefined}</p>
                        </div>
                    )) : undefined
                    }
                    {googleReviewList ? googleReviewList.map(review => (
                        <div style={{
                            background: "#ffffff", padding: "0 10px", margin: "0 auto", maxWidth: "fit-content"
                        }}>
                            <p style={{ color: "black", margin: "5px 0", padding: "5px" }}>{review.text ? review.text : undefined}</p>
                        </div>
                    )) : undefined
                    }
                    {/* form for review add */}
                    <form>
                        <h3 style={{ color: "#5B5542", marginTop: "30px" }}>Add a review</h3>
                        <textarea type="text" style={{ width: "300px" }} value={review} onChange={(event) => setReview(event.target.value)}></textarea>
                        <div>
                            <button className="myButton" onClick={(event) => reviewSubmit(event)}>Submit</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export const StreetViewComponent = withRouter(StreetViewComponentView)

