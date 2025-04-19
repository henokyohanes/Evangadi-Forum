import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../../Routes/Router";
import logo from "../../assets/Images/logo.png";
import styles from "./Footer.module.css";

const Footer = () => {
  const { isLoggedIn } = useContext(AppState);
  const navigate = useNavigate();

  // Navigate based on the user's login status when logo is clicked
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/questions");
    } else {
      navigate("/");
    }
  };

  return (
    <footer className={styles.footerContainer}>
      <div className={`${styles.footerContent} row`}>
        <div className={`${styles.usefulLinks} col-6 col-md-4`}>
          <h3>Useful Link</h3>
          <p><Link to="/how-it-works">How it works</Link></p>
          <p><Link to="/terms-of-service">Terms of Service</Link></p>
          <p><Link to="/privacy-policy">Privacy Policy</Link></p>
        </div>
        <div className={`${styles.contactInfo} col-6 col-md-4 ps-sm-5`}>
          <h3>Contact Info</h3>
          <p><a href="https://evangadi.com/" target="_blank">Evangadi Networks</a></p>
          <p><a href="mailto:support@evangadi.com">support@evangadi.com</a></p>
          <p><a href="tel: +1 202 386 2702" target="_blank">+1 202 386 2702</a></p>
        </div>
        <div className={`${styles.divider} d-md-none`}></div>
        <div className={`${styles.logoAndSocials} col-12 col-md-4`}>
          <div onClick={handleLogoClick}>
            <img src={logo} alt="Evangadi logo" loading="lazy" />
          </div>
          <div className={styles.socialMedia}>
            <a href="https://www.facebook.com/evangaditech/" target="_blank" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/evangaditech/" target="_blank" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.x.com/company/evangaditech/" target="_blank" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://www.youtube.com/evangaditech" target="_blank" aria-label="Youtube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;