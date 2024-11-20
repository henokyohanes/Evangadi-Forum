import React from "react";
import { faHome, faSignInAlt, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/Images/logo.png";
import styles from "./Header.module.css";

const Header = () => {
  

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <a>
          <img src={logo} alt="Evangadi logo" />
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navLinks}>
              <li className={styles.navLinkItem}>
                <a>Home</a>
              </li>
              <li className={styles.navLinkItem}>
                <a>How it works</a>
              </li>
              <li className={styles.navLinkItem}>
                <button className={styles.logoutButton}>
                  Log Out
                </button>
              </li>
              <li className={styles.navLinkItem}>
                <a>How it works</a>
              </li>
              <li className={styles.navLinkItem}>
                <a className={styles.signInButton}>
                  Sign In
                </a>
              </li>
        </ul>
      </nav>

      {/* Mobile Menu Icon */}
      <div className={styles.mobileMenuIcon}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Mobile Dropdown Menu */}
        <div className={styles.mobileDropdown}>
          <ul>
                <li>
                  <a>
                    <FontAwesomeIcon icon={faHome} /> Home
                  </a>
                </li>
                <li>
                  <a>
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </a>
                </li>
                <li>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                </li>
                <li>
                  <a>
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </a>
                </li>
                <li>
                  <a>
                    <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                  </a>
                </li>
          </ul>
        </div>
    </header>
  );
};

export default Header;
