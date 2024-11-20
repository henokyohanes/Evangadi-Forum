import React from "react";
import logo from "../../assets/Images/logo.png";
import { PiFacebookLogoLight } from "react-icons/pi";
import { IoLogoInstagram } from "react-icons/io5";
import { AiOutlineYoutube } from "react-icons/ai";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {/* Logo and Social Media Icons */}
        <div className={styles.logoAndSocials}>
          <img src={logo} alt="Evangadi logo" className={styles.footerLogo} />
          <div className={styles.socialIcons}>
            <a>
              <PiFacebookLogoLight />
            </a>
            <a>
              <IoLogoInstagram />
            </a>
            <a>
              <AiOutlineYoutube />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className={styles.usefulLinks}>
          <h4>Useful Link</h4>
          <ul>
            <li>
              <a>How it works</a>
            </li>
            <li>
              <a>Terms of Service</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className={styles.contactInfo}>
          <h4>Contact Info</h4>
          <p>Evangadi Networks</p>
          <p>support@evangadi.com</p>
          <p>+1-202-386-2702</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
