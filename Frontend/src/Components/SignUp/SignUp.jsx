import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import styles from "./SignUp.module.css";

const Signup = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) return;

    try {
      const response = await axiosBaseURL.post("/users/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registration successful!",
          text: "You have been registered successfully.",
        }).then(() => {
          // Optionally, navigate to another page after success
          window.location.href = "/";
        });
        Swal.fire({
          title: "Success!",
          html:  "user registered successfully!",
          icon: "success",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.successTitle,
            htmlContainer: styles.text,
          },
        });

        setTimeout(() => {navigate("/auth")}, 1500);
      } else {
        Swal.fire({
          title: "Registration failed!",
          html: response.data.msg || "An error occurred during registration.",
          icon: "error",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.errorTitle,
            htmlContainer: styles.text,
          },
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.msg ||
          "Error submitting the form. Please try again.",
      });
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Join the network</h2>
      <p>
        Already have an account?{" "}
        <Link to="/auth" onClick={onToggle}>
          Sign In
        </Link>
      </p>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.inputGroup}>
        {formErrors.username && <div className={styles.error} role="alert">{formErrors.username}</div>}
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
          {formErrors.firstName && <div className={styles.error} role="alert">{formErrors.firstName}</div>}
          <input
            type="text"
            name="firstName"
            placeholder="First name *"
            value={formData.firstName}
            onChange={handleChange}
          />
          </div>
          <div className={styles.inputGroup}>
          {formErrors.lastName && <div className={styles.error} role="alert">{formErrors.lastName}</div>}
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
        {formErrors.email && <div className={styles.error} role="alert">{formErrors.email}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email address *"
          value={formData.email}
          onChange={handleChange}
        />
        </div>
        <div className={styles.inputGroup}>
        {formErrors.password && <div className={styles.error} role="alert">{formErrors.password}</div>}
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
        />
        </div>
        <span>
          <FontAwesomeIcon icon={faInfoCircle} color="#0b5ed7"/>{" "}
          Passwords must be at least 8 characters.
        </span>
        <p>
          I agree to the <a href="/privacy-policy">privacy policy</a> and{" "}
          <Link to="/terms">terms of service</Link>.
        </p>
        <button type="submit">Agree and Join</button>
      </form>
      <p>
        <Link to="/login" onClick={onToggle}>
          Already have an account?{" "}
        </Link>
      </p>
    </div>
  );
};

export default Signup;
