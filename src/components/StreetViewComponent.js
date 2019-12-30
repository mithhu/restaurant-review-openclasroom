import React, { useEffect, useState } from 'react';
import ReactStreetview from 'react-streetview';
import { withRouter, Redirect, NavLink } from "react-router-dom";


const StreetViewComponentView = (props) => {
    // see https://developers.google.com/maps/documentation/javascript
    const googleMapsApiKey = "AIzaSyDGIUkILRvAVhTd5XI4j4M471uNZJmxVLs";
    const [review, setReview] = useState("");
    let [reviewList, setReviewList] = useState(props.location.state.reviews);

    const reviewSubmit = (event) => {
        event.preventDefault();
        reviewList = [...reviewList, {
            "comment": review
        }]
        setReviewList(reviewList);
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
    return (
        <>
            {/* <NavLink>Home</NavLink> */}
            <NavLink to="/">Home</NavLink>
            <div style={{ display: "flex" }}>
                <div style={{
                    width: '50vw',
                    height: '100vh',
                    backgroundColor: '#eeeeee'
                }}>
                    }
                    {props.location.state ?
                        (<ReactStreetview
                            apiKey={googleMapsApiKey}
                            streetViewPanoramaOptions={streetViewPanoramaOptions}
                        />) : (<Redirect to="/" />)
                    }
                </div>
                <div style={{ width: "50vw", textAlign: "center" }}>
                    <h1>Review</h1>
                    {reviewList ?
                        reviewList.map(review => (
                            <>
                                <p>"{review.comment}"</p>
                            </>
                        )

                        ) : undefined
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

