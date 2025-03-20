import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

const Login = ({ onToggle }) => {
  const [formData, setFormData] = useState({email: "", password: ""});
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handler for form submission
  const handleSubmit = async (e) => {
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
      const response = await axiosBaseURL.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);

      // Show SweetAlert2 on successful login
      Swal.fire({
        title: "Good job!",
        text: "Login Successful",
        icon: "success",
      });

      // Save token and navigate to another page
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      // Handle error, show error message using SweetAlert2
      Swal.fire({
        title: "Oops!",
        text: error?.response?.data?.msg || "Login failed",
        icon: "error",
      });
    }
  };

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
