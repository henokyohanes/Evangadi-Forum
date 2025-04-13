import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosBaseURL from "../../Utility/axios";
import Swal from "sweetalert2";
import Layout from "../../Components/Layout/Layout";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosBaseURL.post(`/users/reset-password/${token}`, {
                password,
            });
            Swal.fire("Password reset successfully", "", "success");
            navigate("/login");
        } catch (err) {
            Swal.fire(
                "Error",
                err?.response?.data?.msg || "Invalid or expired link",
                "error"
            );
        }
    };

    return (
        <Layout>
        <form onSubmit={handleReset}>
            <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
        </form>
        </Layout>
    );
};

export default ResetPassword;
