import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import EventOrganizerItem from "../components/eventOrganizers/EventOrganizerItem";
import EventVendorItem from "../components/eventVendor/EventVendorItem";
import * as moment from "moment-timezone";
import VendorDetailProductList from "../components/products/VendorDetailProductList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMapMarkerAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";

const ViewEvent = (props) => {
  const currentEvent = props.location.state.event;
  const user = props.location.state.user;
  const eventVendorId = props.location.state.eventVendorId;
  const venue = currentEvent.venue;
  const id = currentEvent.eventId;
  const [fetchedEOs, setFetchedEOs] = useState([]);
  const [fetchedVendors, setFetchedVendors] = useState([]);
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [productVendor, setProductVendor] = useState(null);

  const BASE_URL = "https://atackmarketingapi.azurewebsites.net/api/";
  const EO_URL = BASE_URL + "EventOrganizer/";
  const VENDOR_URL = BASE_URL + "Events/" + id;

  const [isAdmin, setIsAdmin] = useState(false)
  const [isEO, setIsEO] = useState(false)
  const [isVendor, setIsVendor] = useState(false)

  let history = useHistory();

  const renderAdminPanel = () => {
    if(user.isAdmin) {
      setIsAdmin(true)
    } else if (user.isEventOrganizer) {
      setIsEO(true)
    } 
  }

  const renderVendorPanel = () => {
    if(eventVendorId != null) {
      setIsVendor(true)
    }
  }

  const fetchEOs = () => {
    // if(isAdmin || isEO ){
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((tokenResponse) => {
        fetch(EO_URL + id, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tokenResponse.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            setFetchedEOs(responseData.eventOrganizers);
          });
      });
  };
// }

  const fetchVendors = () => {
    // if(isAdmin || isEO ){
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then((tokenResponse) => {
        fetch(VENDOR_URL + "/Vendors", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tokenResponse.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            setFetchedVendors(responseData.vendors);
          });
      });
  };
// }

  useEffect(() => {
    renderAdminPanel();
    fetchEOs();
    fetchVendors();
    renderVendorPanel();
    setRefreshComponent(false);
  }, [refreshComponent]);

  function handleChange() {
    setRefreshComponent(true);
  }

  function handleClickedProduct(product) {
    setProductVendor(product);
  }

  return (
    <div className="container">
      <div className="eventWrapper">
        <div className="eventHeader">
          <h2>{currentEvent.eventName}</h2>
          <div className="eventTime">
          <FontAwesomeIcon className="clock" icon={faClock} />
          <p>
            {moment
              .utc(currentEvent.eventStartDateTime)
              .local()
              .format("dddd, MMM DD YYYY @ hh:mm A")}
          </p>
          </div>
        </div>
        <div className="venueContainer">
          <div className="venueDetails">
            <div className="venueLocation">
            <FontAwesomeIcon className="location" icon={faMapMarkerAlt} />
            <p className="venue">{venue.venueName}</p>
            </div>
            <div className="venueLocation">
            <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon className="website" icon={faGlobe} />{" "}
            {venue.website}
          </a>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div>
        <div className="edit-del-links">
          <Link
             to={{
              pathname: "/editEvent",
              state: { currentEvent, user },
            }}
          >
        {" "}
        <p className="edit">Edit Event</p>{" "}
        </Link>
    <Link
        to={{
          pathname: "/deleteEvent",
          state: { currentEvent },
        }}
    >
  {" "}
      <p className="delete">Delete</p>{" "}
      </Link>
        </div>

       
        <div className="eventDetailsWrapper">
          <div className="eventOrganziersContainer">
            <div className="containerHeading">
              <h3 className="eventOrganizers">Event Organizers</h3>
              <Link
                to={{
                  pathname: "/addeventorganizers",
                  state: { currentEvent, fetchedEOs, user },
                }}
              >
                <button className="addVendorButton">Add Organizer</button>
              </Link>
            </div>
            {fetchedEOs.length === 0 ? (
              <p className="nullText">
                No event organizers have been added yet.
              </p>
            ) : (
              <ul className="eventOrganizersList">
                {fetchedEOs.map((eo) => (
                  <EventOrganizerItem
                    key={eo.eventOrganizerId}
                    eo={eo}
                    eventId={id}
                    handleChange={handleChange}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="eventVendorsContainer">
            <div className="containerHeading">
              <h3 className="eventVendors">Event Vendors</h3>
              <Link
                to={{
                  pathname: "/addeventvendor",
                  state: { currentEvent, fetchedVendors, user },
                }}
              >
                <button className="addVendorButton">Add Vendor</button>
              </Link>
            </div>

            {fetchedVendors.length === 0 ? (
              <p>No Vendors have been added yet.</p>
            ) : (
              <ul className="eventVendorsList">
                {fetchedVendors.map((vendor) => (
                    <EventVendorItem
                      key={vendor.eventVendorId}
                      vendor={vendor}
                      eventId={id}
                      eventName={currentEvent.eventName}
                      handleChange={handleChange}
                      handleClickedProduct={handleClickedProduct}
                    />
                ))}
              </ul>
            )}
          </div>
        </div>
        </div>
         )}
          {isEO && (
          <div className="eventVendorsContainer-eo">
            <div className="containerHeading">
              <h3 className="eventVendors">Event Vendors</h3>
              <Link
                to={{
                  pathname: "/addeventvendor",
                  state: { currentEvent, fetchedVendors, user },
                }}
              >
                <button className="addVendorButton">Add Vendor</button>
              </Link>
            </div>

            {fetchedVendors.length === 0 ? (
              <p>No Vendors have been added yet.</p>
            ) : (
              <ul className="eventVendorsList">
                {fetchedVendors.map((vendor) => (
                  <div>
                    <EventVendorItem
                      key={vendor.eventVendorId}
                      vendor={vendor}
                      eventId={id}
                      eventName={currentEvent.eventName}
                      handleChange={handleChange}
                    />
                  </div>
                ))}
              </ul>
            )}
          </div>

         )}
         {isVendor && (
        <div className="eventVendorWrapper">
          <div className="containerHeading">
         <h3 className="eventVendors">Event Products</h3>
            </div>
              <VendorDetailProductList 
                eventId={id}
                eventName={currentEvent.eventName}
                eventVendorId={eventVendorId}
               />
          </div>
    )}
      </div>
    </div>
  );
};

export default ViewEvent;
