import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import NotFound from "../../Components/NotFound/NotFound";
import Layout from "../../Components/Layout/Layout";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const input = {};

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            input.Errors = "Email is required.";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            input.Errors = "Invalid email format.";
            isValid = false;
        }

        setFormErrors(input);
        return isValid;
    };

    //function to reset password
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(false);

        try {
            const response = await axiosBaseURL.post("/users/forgot-password", {
                email,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: "Email Sent",
                    text: "Check your inbox for password reset instructions.",
                    icon: "success",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.successTitle,
                        htmlContainer: styles.text,
                    },
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (error) {
            console.error("Error sending password reset email:", error);
            if (error?.response) {
                Swal.fire({
                    title: "Error",
                    text: error?.response?.data?.msg || "Something went wrong. Please try again later.",
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
    };

    return (
        <Layout>
            {!error ? (<div className={styles.forgotPasswordContainer}>
                <div className={styles.forgotPassword}>
                    <h2>Reset Your Password</h2>
                    <p>
                        Please enter the email address associated with your account. Then We’ll
                        send you a link to reset your password and regain access.
                    </p>
                    <form onSubmit={handleSubmit}>
                        {formErrors && <div className={styles.formError}>{formErrors.Errors}</div>}
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <ScaleLoader color="#fff" height={12} /> : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>) : <NotFound />}
        </Layout>
    );
};

export default ForgotPassword;