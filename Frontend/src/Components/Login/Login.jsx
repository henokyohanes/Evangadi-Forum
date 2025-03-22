import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

const Login = ({ onToggle, setError }) => {
  const [formData, setFormData] = useState({email: "", password: ""});
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the input field
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error messages when the user starts typing
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
  };

  // Handler for form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Handle client side validations here
    let valid = true;

    const { email, password } = formData;

    // Email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!regex.test(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    try {

      setLoading(true);
      setError(false);

      const response = await axiosBaseURL.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      if (response?.status === 200) {

      Swal.fire({
        title: "Success!",
        html: "You have logged in successfully.",
        icon: "success",
        customClass: {
          popup: styles.popup,
          confirmButton: styles.confirmButton,
          icon: styles.icon,
          title: styles.successTitle,
          htmlContainer: styles.text,
        },
      });
      }

      // Save token and navigate to another page
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {window.location.href = "/"}, 1500);
    } catch (err) {
      console.error("Failed to login:", err);
      console.log(err);
      if (err?.response?.status === 401 || err?.response?.status === 500) {
        
        Swal.fire({
          title: "Failed!",
          html: err?.response?.data?.msg,
          icon: "error",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.errorTitle,
            htmlContainer: styles.text,
          }
        });
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login to your account</h2>
      <p>
        Don’t have an account?{" "}
        <Link to="" onClick={onToggle}>
          Create a new account
        </Link>
      </p>
      {/* Login Form */}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          {/* Email input section */}
          {emailError && (
            <div className={styles.error} role="alert">
              {emailError}
            </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          {/* Password input section */}
          {passwordError && (
            <div className={styles.error} role="alert">
              {passwordError}
            </div>
          )}
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className={styles.passwordToggleIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className={styles.forgotPassword}>
          <Link to="#">Forgot password?</Link>
        </div>
        <button type="submit" className={styles.loginButton}>
          {loading ? <ScaleLoader color="#fff" height={12} /> : "LogIn"}
        </button>
      </form>
    </div>
  );
};

export default Login;
