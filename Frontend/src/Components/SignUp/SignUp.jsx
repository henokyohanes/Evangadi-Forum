import React, { useState } from "react";
import classes from "./SignUp.module.css";
import { Link } from "react-router-dom";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";

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
    const errors = {};
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate username
    if (!usernameRegex.test(formData.username)) {
      errors.username = "Username must be alphanumeric.";
    }

    // Validate first and last name
    if (!nameRegex.test(formData.firstName)) {
      errors.firstName = "First name must contain only letters.";
    }
    if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "Last name must contain only letters.";
    }

    // Validate email
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    // Validate password (for simplicity, let's say it must be at least 6 characters)
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setFormErrors(errors);

    // If there are errors, show SweetAlert popup for each error
    if (Object.keys(errors).length > 0) {
      if (errors.username) {
        Swal.fire({
          icon: "error",
          title: "Invalid Username",
          text: errors.username,
        });
      } else if (errors.firstName) {
        Swal.fire({
          icon: "error",
          title: "Invalid First Name",
          text: errors.firstName,
        });
      } else if (errors.lastName) {
        Swal.fire({
          icon: "error",
          title: "Invalid Last Name",
          text: errors.lastName,
        });
      } else if (errors.email) {
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: errors.email,
        });
      } else if (errors.password) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: errors.password,
        });
      }

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

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
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: response.data.msg || "An error occurred during registration.",
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
    <div className={classes.signup_container}>
      <h2>Join the network</h2>
      <p>
        Already have an account?{" "}
        <Link to="/login" onClick={onToggle}>
          Sign in
        </Link>
      </p>

      {/* Signup Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <div className={classes.name_fields}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
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
