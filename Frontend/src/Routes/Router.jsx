import React, {useEffect, useState, useRef, createContext, useCallback} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Question from "../pages/Question/Question";
import Answer from "../pages/Answer/Answer";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";
import axiosBaseURL from "../Utility/axios";
import HowItWorks from "../pages/HowItWork/HowItWork";
import Account from "../pages/Account/Account";
import MyQuestions from "../pages/MyQuestions/MyQuestions";
import AllUsers from "../pages/AllUsers/AllUsers";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy"; 
import styles from "./Router.module.css";

export const AppState = createContext();

const RouterApp = () => {
  const [user, setUser] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(300);

  const navigate = useNavigate();

  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);
  const countdownInterval = useRef(null);

  // Function to check if the user is logged in
  async function checkUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axiosBaseURL.get("/users/check", {
        headers: {Authorization: `Bearer ${token}`}
      });
      setUser(data);
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  }

  // Function to handle login
  const handleLogin = async (userData) => {
    localStorage.setItem("token", userData.token);
    await checkUser();
    resetTimers();
  };

  // Function to handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser({});
    setShowWarning(false);
    clearTimers();
    navigate("/");
  }, [navigate]);

  // Function to reset timers
  const resetTimers = useCallback(() => {
    clearTimers();
    setCountdown(300);

    // Show warning after 25 minutes
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);

      // Start countdown timer
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 25 * 60 * 1000);

    // Logout after 30 minutes
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000);
  }, [handleLogout]);

  // Function to clear timers
  const clearTimers = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  // useEffect to handle inactivity
  useEffect(() => {
    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    const activityListener = () => {
      if (localStorage.getItem("token")) {
        setShowWarning(false);
        setCountdown(300);
        clearInterval(countdownInterval.current);
        resetTimers();
      }
    };

    if (localStorage.getItem("token")) {
      checkUser();
      events.forEach((event) =>
        window.addEventListener(event, activityListener)
      );
      resetTimers();
    }

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityListener)
      );
      clearTimers();
    };
  }, [resetTimers]);

  const isLoggedIn = !!user.userid;

  return (
    <AppState.Provider value={{ user, setUser, isLoggedIn, handleLogout, handleLogin }}>
      {showWarning && (
        <div className={styles.inactivityWarningContainer}>
          <div className={styles.inactivityWarning}>
            <h2>Inactivity Warning</h2>
            <p>
              You’ll be logged out in {Math.floor(countdown / 60)}:
              {String(countdown % 60).padStart(2, "0")} due to inactivity.
            </p>
            <button
              onClick={() => {
                setShowWarning(false);
                setCountdown(300);
                clearInterval(countdownInterval.current);
                resetTimers();
              }}
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/questions" element={<Home />} />
        <Route path="/questions/ask" element={<Question />} />
        <Route path="/questions/getQuestions/:questionid" element={<Question />} />
        <Route path="/getQuestions/:questionid" element={<Answer />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-questions" element={<MyQuestions />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </AppState.Provider>
  );
};

export default RouterApp;