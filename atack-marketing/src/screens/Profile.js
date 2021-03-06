import React, { useState } from "react";
import firebase from "../firebase";
import Logo from "../assets/full-logo.png";
import Logout from "../components/Logout";

const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);

  const getCurrentUser = async () => {
    try {
      let currentUser = await firebase.auth().currentUser;

      if (currentUser != null) {
        setCurrentUser(currentUser);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
    }
  };
  getCurrentUser();
  function getLoggedIn(boolean) {
    setLoggedIn(boolean);
  }

  return (
    <div className="auth-container">
      <img className="logo" src={Logo} alt="logo" />
      <div className="auth-wrapper">
        {loggedIn && <p>Currently logged in as: {currentUser.email}.</p>}
        <div>{loggedIn && <Logout getLoggedIn={getLoggedIn} />}</div>
      </div>
    </div>
  );
};
export default Profile;
