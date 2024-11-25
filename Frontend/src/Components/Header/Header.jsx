import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppState } from "../../Routes/Router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome, faSignInAlt, faSignOutAlt, faBars} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/Images/logo-1.png";
import styles from "./Header.module.css";
import ProfileImage from "../ProfileImage/ProfileImage";

const Header = () => {
  const { isLoggedIn, handleLogout } = useContext(AppState);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogoutClick = () => {
    handleLogout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <Link to="">
          <img src={logo} alt="Evangadi logo" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navLinks}>
          {isLoggedIn ? (
            <>
              <li className={styles.navLinkItem}>
                <Link to="/">Home</Link>
              </li>
              <li className={styles.navLinkItem}>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li className={styles.navLinkItem}>
                <button className={styles.logoutButton} onClick={onLogoutClick}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navLinkItem}>
                <Link to="/how-it-works">How it works</Link>
              </li>
              <li className={styles.navLinkItem}>
                <Link to="/login" className={styles.signInButton}>
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Menu Icon */}
      <div className={styles.mobileMenuIcon} onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDropdown}>
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
      )}
    </header>
  );
};

export default Header;
