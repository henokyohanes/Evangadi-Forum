import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { AppState } from "../../Routes/Router";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useContext(AppState);

  // State to store questions
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;
  const navigate = useNavigate();

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosBaseURL.get("/questions/getQuestions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle click event to navigate to detail page
  const handleQuestionClick = (questionid) => {
    navigate(`/getQuestions/${questionid}`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter questions based on search term
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the "Ask Question" page
  const handleAskQuestionClick = () => {
    navigate("/questions/ask");
  };

  return (
    <Layout>
      <div className={styles.parentContainer}>
        <main className={styles.mainContent}>
          {/* header container */}
          <div className={styles.headerContainer}>
            <button
              className={styles.askButton}
              onClick={handleAskQuestionClick}
            >
              Ask Question
            </button>
            <h3 className={styles.username}>
              <span className={styles.span}>Welcome</span>, {user.username}
            </h3>
          </div>
          {/* search bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <h3 className={styles.questionHeader}>Questions</h3>
          <hr style={{ marginBottom: "20px" }} />

          {loading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className={styles.noMatchMessage}>
              No matching questions found.
            </div>
          ) : (
            <ul className={styles.questionList}>
              {currentQuestions.map((q, index) => (
                <Link
                  to={`/getQuestions/${q.questionid}`}
                  key={index}
                  className={styles.questionLink}
                >
                  <li className={styles.questionItem}>
                    <div className={styles.listContainer}>
                      <div className={styles.profileImgContainer}>
                        {q.profileimg ? (
                          <img
                            src={`${axiosImageURL}${q.profileimg}`}
                            className={styles.profileImg}
                            alt="Profile"
                            loading="lazy"
                          />
                        ) : (
                          <RiAccountCircleFill
                            className={styles.profileImgCircle}
                          />
                        )}
                      </div>
                      <p style={{ fontWeight: "bold" }}>{q.username}</p>
                    </div>
                    {/* Question Text */}
                    <div className={styles.questionText}>
                      <strong>{q.title}</strong>
                      <p>
                        {/* Date */}
                        <p>
                          {new Date(q.tag).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuestionClick(q.questionid)}
                      className={styles.questionButton}
                    >
                      ➡
                    </button>
                  </li>
                </Link>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastQuestion >= filteredQuestions.length}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </main>
        <div className={styles.profileImageContainer}></div>
        <ProfileImage />
      </div>
    </Layout>
  );
}

export default Home;
