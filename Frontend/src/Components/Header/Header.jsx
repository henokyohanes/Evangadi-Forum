import React, { useState } from "react";
import logo from "../../assets/Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome, faSignInAlt, faSignOutAlt, faBars} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

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
            <>
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
            </>
            <>
              <li className={styles.navLinkItem}>
                <a>How it works</a>
              </li>
              <li className={styles.navLinkItem}>
                <a className={styles.signInButton}>
                  Sign In
                </a>
              </li>
            </>
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
              <>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <a>
                    <FontAwesomeIcon icon={faHome} /> Home
                  </a>
                </li>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <>
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </>
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
              <>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <a>
                    <FontAwesomeIcon icon={faHome} /> How it works
                  </a>
                </li>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <a>
                    <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                  </a>
                </li>
              </>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
