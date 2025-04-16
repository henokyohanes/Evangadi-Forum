import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import NotFound from "../../Components/NotFound/NotFound";
import Layout from "../../Components/Layout/Layout";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const input = {};

        //password validation
        const passwordRegex = /^.{8,}$/;
        if (!password) {
            input.Errors = "Password is required.";
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            input.Errors = "Password must be at least 8 characters.";
            isValid = false;
        }

        setFormErrors(input);
        return isValid;
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(false);

        try {
            const res = await axiosBaseURL.post(`/users/reset-password/${token}`, {
                password,
            });
            Swal.fire({
                title: "Success",
                text: "Password reset successfully.",
                icon: "success",
                timer: 1500,
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate("/") }, 1500);
        } catch (err) {
            console.error("Error resetting password:", err);
            if (err?.response) {
                Swal.fire({
                    title: "Failed!",
                    html: err.response?.data?.msg || "Invalid or expired link",
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
        <Layout>
            {!error ? (<div className={styles.resetPasswordContainer}>
                <div className={styles.resetPassword}>
                    <h2>Reset Password</h2>
                    <p>Enter your new password below.</p>
                    <form onSubmit={handleReset}>
                        {formErrors && <div className={styles.formError}>{formErrors.Errors}</div>}
                        <input
                            type="password"
                            placeholder="new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <ScaleLoader color="#fff" height={12} /> : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>) : <NotFound />}
        </Layout>
    );
};

export default ResetPassword;
