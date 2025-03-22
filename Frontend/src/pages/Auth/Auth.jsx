import React, { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import Signup from "../../Components/SignUp/SignUp";
import Login from "../../Components/Login/Login";
import styles from "./Auth.module.css";
import About from "../../Components/About/About";
import NotFound from "../../Components/NotFound/NotFound";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Layout>
      {!error ? (<div className={styles.authContainer}>
        <div className={`${styles.authContent} row g-0`}>
          <div className="col-12 col-lg-6">
            {isLogin ? (
              <Login onToggle={handleToggle} setError={setError} />
            ) : (
              <Signup onToggle={handleToggle} setError={setError} />
            )}
          </div>
          <div className="d-none d-lg-block col-lg-6">
            <About />
          </div>
        </div>
      </div>) : <NotFound />}
    </Layout>
  );
}

export default Auth;
