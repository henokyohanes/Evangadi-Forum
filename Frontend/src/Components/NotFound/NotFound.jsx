import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {

  const location = useLocation();

  // Reload the page when the user goes back to the home page
  const handleGoHome = () => {
    if (location.pathname === "/") {
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message} role="alert">Oops! Page not found.</p>
      <Link to="/questions" className={styles.link} onClick={handleGoHome}>
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;