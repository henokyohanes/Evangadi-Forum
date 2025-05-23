import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import styles from "./SignUp.module.css";

const Signup = ({ onToggle, setError }) => {

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the input value
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Remove error immediately when user starts typing
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Regular expressions for validation
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    //username validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!formData.username) {
      errors.username = "Username is required.";
      isValid = false;
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = "Username must be alphanumeric.";
      isValid = false;
    }

    //name validation
    const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
    if (!formData.firstName) {
      errors.firstName = "First name is required.";
      isValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      errors.firstName = "Invalid first name format.";
      isValid = false;
    }
    if (!formData.lastName) {
      errors.lastName = "Last name is required.";
      isValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "Invalid last name format.";
      isValid = false;
    }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
      isValid = false;
    }

    //password validation
    const passwordRegex = /^.{8,}$/;
    if (!formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {

      setLoading(true);
      setError(false);

      const response = await axiosBaseURL.post("/users/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          html: "user registered successfully!",
          icon: "success",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.successTitle,
            htmlContainer: styles.text,
          },
        });

        // Store the token in local storage and redirect to the home page
        localStorage.setItem("token", response.data.token);
        setTimeout(() => { window.location.href = "/questions" }, 1500);
      }
    } catch (err) {
      console.error("Failed to register user:", err);

      if (err.response) {
        Swal.fire({
          title: "Failed!",
          html: err.response?.data?.msg,
          icon: "error",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.errorTitle,
            htmlContainer: styles.text
          },
        });
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Join the network</h2>
      <p>
        Already have an account?{" "}
        <Link to="/" onClick={onToggle}>Sign In</Link>
      </p>
      {/* Signup Form */}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.inputGroup}>
          {formErrors.username &&
            <div className={styles.error} role="alert">{formErrors.username}</div>
          }
          <input
            type="text"
            name="username"
            placeholder="Username *"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className={styles.name_fields}>
          <div className={styles.inputGroup}>
            {formErrors.firstName &&
              <div className={styles.error} role="alert">{formErrors.firstName}</div>
            }
            <input
              type="text"
              name="firstName"
              placeholder="First name *"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            {formErrors.lastName &&
              <div className={styles.error} role="alert">{formErrors.lastName}</div>
            }
            <input
              type="text"
              name="lastName"
              placeholder="Last name *"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          {formErrors.email &&
            <div className={styles.error} role="alert">{formErrors.email}</div>
          }
          <input
            type="email"
            name="email"
            placeholder="Email address *"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          {formErrors.password &&
            <div className={styles.error} role="alert">{formErrors.password}</div>
          }
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <span>
          <FontAwesomeIcon icon={faInfoCircle} color="#0b5ed7" />{" "}
          Passwords must be at least 8 characters.
        </span>
        <div className={styles.terms}>
          I agree to the <Link to="/privacy-policy">privacy policy</Link> and{" "}
          <Link to="/terms-of-service">terms of service</Link>.
        </div>
        <button type="submit">
          {loading ? <ScaleLoader color="#fff" height={12} /> : "Agree and Join"}
        </button>
      </form>
      <p>
        <Link to="/" onClick={onToggle}>
          Already have an account?{" "}
        </Link>
      </p>
    </div>
  );
};

export default Signup;