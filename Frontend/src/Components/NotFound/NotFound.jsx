import React from "react";
import styles from "./NotFound.module.css";
import Layout from "../Layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! Page not found.</p>
        <a href="/" className={styles.link}>
          Go back home
        </a>
      </div>
    </Layout>
  );
};

export default NotFound;
