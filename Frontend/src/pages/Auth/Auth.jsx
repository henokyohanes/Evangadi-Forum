import React, { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import Signup from "../../Components/SignUp/SignUp";
import Login from "../../Components/Login/Login";
import styles from "./Auth.module.css";
import About from "../../Components/About/About";

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
