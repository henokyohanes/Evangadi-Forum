// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const Login = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation using toast for errors
  const validateForm = () => {
    const { email, password } = formData;

    if (!email) {
      toast.error("Please provide an email address.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    if (!password) {
      toast.error("Please provide a password.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }

    return true; // Form is valid
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const response = await axiosBaseURL.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

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
      }, 2000);
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
      <ToastContainer />
      <h2 className={styles.title}>Login to your account</h2>
      <p className={styles.subtitle}>
        Don’t have an account?{" "}
        <Link to="" onClick={onToggle} className={styles.createAccount}>
          Create a new account
        </Link>
      </p>
      {/* Login Form */}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          {/* Email input section */}
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.passwordWrapper}>
            {/* Password input section */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.input}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className={styles.passwordToggleIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙊" : "🙈"} {/* Eye icon to toggle */}
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
