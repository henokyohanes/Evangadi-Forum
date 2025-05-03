import React, { useState, useEffect, useContext } from 'react'
import { RiAccountCircleFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import Layout from '../../Components/Layout/Layout'
import NotFound from '../../Components/NotFound/NotFound';
import Loader from '../../Components/Loader/Loader';
import styles from "./AllUsers.module.css";

function AllUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;
    const token = localStorage.getItem("token");

    // Fetch question, answers, and reactions
    const fetchUsers = async () => {
        try {

            setLoading(true);
            setError(false);

            const response = await axiosBaseURL.get("/users/all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(response.data.users);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Delete answer
    const handleDeleteUser = async (userid) => {

        try {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this user?",
                html: "All related data associated with this user will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text,
                },
            });
            if (!result.isConfirmed) return;
            setLoading(true);
            setError(false);

            await axiosBaseURL.delete(`/users/delete-user/${userid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User Deleted Successfully", { autoClose: 1500 });
            setUsers(users.filter((user) => user.userid !== userid));
        } catch (err) {
            console.error("Error deleting answer:", err);
            if (err.response) {
                toast.error("Failed to delete user. Please try again", {
                    autoClose: 1500,
                });
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            {!loading && !error ? (
                <div className={styles.container}>
                    <div className={styles.usersSection}>
                        <h2>All Users</h2>
                        {users && users.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <div key={index} className={styles.userContainer}>
                                    <div
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteUser(user.userid)}
                                    >
                                        <FaTrash />
                                    </div>
                                    <div key={index} className={styles.userItem}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.profileImgContainer}>
                                                {user.profileimg ? (
                                                    <img
                                                        src={`${axiosImageURL}${user.profileimg}`}
                                                        alt="Profile Image"
                                                        className={styles.profileImg}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <RiAccountCircleFill
                                                        className={styles.ProfileImgCircle}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.userContent}>
                                            <p><strong>Name</strong> <span className={styles.name}>{user.firstname} {user.lastname}</span></p>
                                            <p><strong>Username</strong> <span className={styles.username}>{user.username}</span></p>
                                            <p><strong>Email</strong> <span className={styles.email}>{user.email}</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noUsers}>No users yet!</p>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    {users && users.length > 0 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of{" "}
                                {Math.ceil(users.length / usersPerPage)}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={indexOfLastUser >= users.length}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : error ? (
                <NotFound />
            ) : (
                <Loader />
            )}
        </Layout>
    );
}

export default AllUsers