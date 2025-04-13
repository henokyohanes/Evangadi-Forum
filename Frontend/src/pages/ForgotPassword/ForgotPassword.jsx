import React, { useState } from "react";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import Layout from "../../Components/Layout/Layout";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        try {
            const response = await axiosBaseURL.post("/users/forgot-password", {
              email,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: "Email Sent",
                    text: "Check your inbox for password reset instructions.",
                    icon: "success",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.msg || "Something went wrong.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.forgotContainer}>
                <h2>Reset Your Password</h2>
                <p>
                    Please enter the email address associated with your account. We’ll
                    send you a link to reset your password and regain access.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;