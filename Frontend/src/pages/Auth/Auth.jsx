import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Signup from "../../components/SignUp/SignUp";
import Login from "../../components/Login/Login";
import styles from "./Auth.module.css";
import About from "../../components/About/About";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Layout>
      <div className={styles.authContainer}>
        <div className={styles.authContent}>
          <div>
            {isLogin ? (
              <Login onToggle={handleToggle} />
            ) : (
              <Signup onToggle={handleToggle} />
            )}
          </div>

          <div className={styles.about}>
            <About />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Auth;
