import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppState } from "../../Routes/Router";
import { NavDropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome, faSignInAlt, faSignOutAlt, faBars} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/Images/logo-1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Header.module.css";
import ProfileImage from "../ProfileImage/ProfileImage";

const Header = () => {
  const { isLoggedIn, handleLogout } = useContext(AppState);

  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.header}>
        <NavDropdown title={<FaBars size={35} />} className="d-md-none">
          {isLoggedIn && (
            <NavDropdown.Item as={Link} to="/">
              Home
            </NavDropdown.Item>
          )}
          <NavDropdown.Item as={Link} to="/how-it-works">
            How it works
          </NavDropdown.Item>
        </NavDropdown>
        <Link to="/">
          <img src={logo} alt="Evangadi logo" loading="lazy" />
        </Link>
        <div className={styles.navMenu}>
          <ul className="d-none d-md-flex">
            {isLoggedIn && (
              <li>
                <Link to="/">Home</Link>
              </li>
            )}
            <li>
              <Link to="/how-it-works">How it works</Link>
            </li>
          </ul>
          <div>
            {isLoggedIn ? (
              <Link
                to="/"
                // className={styles.signInButton}
                onClick={onLogoutClick}
              >
                logout
              </Link>
            ) : (
              <Link to="/login" className={styles.signInButton}>
                Sign In
              </Link>
            )}
          </div>
        </div>
        {/* Desktop Navigation */}
        {/* <nav className={styless.nav}>
        <ul className={styless.navLinks}>
          {isLoggedIn ? (
            <>
              <li className={styless.navLinkItem}>
                <Link to="/">Home</Link>
              </li>
              <li className={styless.navLinkItem}>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li className={styless.navLinkItem}>
                <button className={styless.logoutButton} onClick={onLogoutClick}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={styless.navLinkItem}>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li className={styless.navLinkItem}>
                <Link to="/login" className={styless.signInButton}>
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav> */}

        {/* Mobile Menu Icon */}
        {/* <div className={styless.mobileMenuIcon} onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div> */}

        {/* Mobile Dropdown Menu */}
        {/* {isMobileMenuOpen && (
        <div className={styless.mobileDropdown}>
          <ul>
            {isLoggedIn ? (
              <>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/">
                    <FontAwesomeIcon icon={faHome} /> Home
                  </Link>
                </li>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/how-it-works">
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </Link>
                </li>
                <li
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogoutClick();
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                </li>
              </>
            ) : (
              <>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/how-it-works">
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </Link>
                </li>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">
                    <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ProfileImage /> 
        </div>
      )} */}
      </div>
    </header>
  );
};

export default Header;
