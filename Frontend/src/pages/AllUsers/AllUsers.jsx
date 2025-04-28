import React, { useState, useEffect } from 'react'
import { RiAccountCircleFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import Layout from '../../Components/Layout/Layout'
import NotFound from '../../Components/NotFound/NotFound';
import Loader from '../../Components/Loader/Loader';
import styles from "./AllUsers.module.css";

function AllUsers() {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const token = localStorage.getItem("token");

  // Fetch question, answers, and reactions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axiosBaseURL.get("/questions/getQuestions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  

  

  

  // Delete answer
  const handleDeleteUser = async (answerId) => {
    try {
      await axiosBaseURL.delete(`/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Answer Deleted Successfully", { autoClose: 1500 });
      fetchQuestion();
    } catch (err) {
      console.error("Error deleting answer:", err);
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
          <div className={styles.answersSection}>
            <h2>All Users</h2>
            {answers && answers.length > 0 ? (
              currentAnswers.map((ans, index) => (
                <div key={index} className={styles.answerContainer}>
                  {user.email === "admin@admin.com" && (
                    <div
                      className={styles.deleteIcon}
                      onClick={() => handleDeleteUser(ans.answerid)}
                    >
                      <FaTrash />
                    </div>
                  )}
                  <div key={index} className={styles.answerItem}>
                    <div className={styles.answerInfo}>
                      <div className={styles.profileImgContainer}>
                        {ans.profileimg ? (
                          <img
                            src={`${axiosImageURL}${ans.profileimg}`}
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
                    <div className={styles.answerContent}>
                      <p>{ans.answer}</p>

                      <p className={styles.username}>{ans.username}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noAnswers}>No users yet!</p>
            )}
          </div>
          {/* Pagination Controls */}
          {answers && answers.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(answers.length / answersPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastAnswer >= answers.length}
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
