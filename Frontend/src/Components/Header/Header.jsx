import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppState } from "../../Routes/Router";
import { NavDropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { RiAccountCircleFill } from "react-icons/ri";
import { axiosImageURL } from "../../Utility/axios";
import logo from "../../assets/Images/logo-1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Header.module.css";
import { FaCaretDown } from "react-icons/fa";

const ProfileImage = ({ user }) => {
  return (
      <div className={styles.profileImgContainer}>
        {user.profileimg ? (
          <img
            src={`${axiosImageURL}${user.profileimg}`}
            className={styles.profileImg}
            alt="Profile Image"
            loading="lazy"
          />
        ) : (
          <RiAccountCircleFill className={styles.profileImgCircle} />
        )}
      </div>
  );
};

const Header = () => {
  const { user, isLoggedIn, handleLogout } = useContext(AppState);

  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.header}>
        <Link to="/">
          <img src={logo} alt="Evangadi logo" loading="lazy" />
        </Link>
        <NavDropdown
          title={
            isLoggedIn ? <ProfileImage user={user} /> : <FaBars size={35} />
          }
          className="d-sm-none"
        >
          {isLoggedIn && (
            <NavDropdown.Item as={Link} to="/">
              Home
            </NavDropdown.Item>
          )}
          <NavDropdown.Item as={Link} to="/how-it-works">
            How it works
          </NavDropdown.Item>
          {isLoggedIn && (
            <NavDropdown.Item onClick={onLogoutClick}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </NavDropdown.Item>
          )}
        </NavDropdown>
        <div className={`${styles.navMenu} d-none d-sm-flex`}>
          {isLoggedIn && <Link to="/">Home</Link>}
          <Link to="/how-it-works">How it works</Link>
          {isLoggedIn && (
            <NavDropdown
              title={<ProfileImage user={user} />}
            >
              <NavDropdown.Item onClick={onLogoutClick}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </NavDropdown.Item>
            </NavDropdown>            
          )}          
        </div>
      </div>
    </header>
  );
};

export default Header;
