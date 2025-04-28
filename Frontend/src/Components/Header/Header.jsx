import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppState } from "../../Routes/Router";
import { NavDropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faInfoCircle, faUser, faQuestionCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { RiAccountCircleFill } from "react-icons/ri";
import { axiosImageURL } from "../../Utility/axios";
import logo from "../../assets/Images/logo-1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Header.module.css";

// Profile Image component
const ProfileImage = ({ user }) => {
  return (
    <div className={styles.profileImgWrapper}>
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
      <div className={styles.profileArrow}>
        <FontAwesomeIcon icon={faChevronDown} className={styles.arrowIcon} />
      </div>
    </div>
  );
};

const Header = () => {

  const { user, isLoggedIn, handleLogout } = useContext(AppState);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate based on the user's login status when logo is clicked
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/questions");
    } else {
      navigate("/");
    }
  };

  // Handle logout
  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.header}>
        <div onClick={handleLogoClick}>
          <img src={logo} alt="Evangadi logo" loading="lazy" />
        </div>
        {/* Dropdown menu for small screens */}
        <NavDropdown
          className="d-sm-none"
          title={
            isLoggedIn && location.pathname !== "/" ? (
              <ProfileImage user={user} />
            ) : (
              <FaBars size={35} />
            )
          }
        >
          {isLoggedIn && (
            <NavDropdown.Item as={Link} to="/questions">
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faHome} />
              </span>
              Home
            </NavDropdown.Item>
          )}
          <NavDropdown.Item as={Link} to="/how-it-works">
            <span className={styles.icon}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
            How it works
          </NavDropdown.Item>
          {!isLoggedIn && location.pathname !== "/" && (
            <NavDropdown.Item as={Link} to="/">
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              Register | Sign in
            </NavDropdown.Item>
          )}
          {isLoggedIn && location.pathname !== "/" && (
            <div>
              <NavDropdown.Item as={Link} to="/Account">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUser} />
                </span>
                Account Settings
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my-questions">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                My Questions
              </NavDropdown.Item>
              {user.email === "admin@admin.com" && <NavDropdown.Item as={Link} to="/all-users">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUser} />
                </span> All Users
              </NavDropdown.Item>}
              <NavDropdown.Item onClick={onLogoutClick}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                Logout
              </NavDropdown.Item>
            </div>
          )}
        </NavDropdown>
        <div className={`${styles.navMenu} d-none d-sm-flex`}>
          {isLoggedIn && <Link to="/questions">Home</Link>}
          <Link to="/how-it-works">How it works</Link>
          {!isLoggedIn && location.pathname !== "/" && (
            <Link to="/">Register | Sign in</Link>
          )}
          {/* Dropdown menu for large screens */}
          {isLoggedIn && location.pathname !== "/" && (
            <NavDropdown title={<ProfileImage user={user} />}>
              <NavDropdown.Item as={Link} to="/Account">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUser} />
                </span>
                Account Settings
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my-questions">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                My Questions
              </NavDropdown.Item>
              {user.email === "admin@admin.com" && <NavDropdown.Item as={Link} to="/all-users">
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUser} />
                </span> All Users
              </NavDropdown.Item>}
              <NavDropdown.Item onClick={onLogoutClick}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;