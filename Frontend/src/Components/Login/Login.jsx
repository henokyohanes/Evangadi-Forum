import React from "react";
import styles from "./Login.module.css";

const Login = ({ onToggle }) => {
  
  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login to your account</h2>
      <p className={styles.subtitle}>
        Don’t have an account?{" "}
        <a onClick={onToggle} className={styles.createAccount}>
          Create a new account
        </a>
      </p>
      {/* Login Form */}
      <form className={styles.loginForm}>
        <div className={styles.inputGroup}>
          {/* Email input section */}
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="Email address"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.passwordWrapper}>
            {/* Password input section */}
            <input
              type="password"
              name="password"
              className={styles.input}
              placeholder="Password"
              required
            />
            <span
              className={styles.passwordToggleIcon}
            >
            </span>
          </div>
        </div>
        <div className={styles.forgotPassword}>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
