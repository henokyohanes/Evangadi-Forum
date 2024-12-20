import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { createContext } from "react";
import Question from "../pages/Question/Question";
import Answer from "../pages/Answer/Answer";
import Home from "../pages/Home/Home";
import NotFound from "../components/NotFound/NotFound";
import Auth from "../pages/Auth/Auth";
import axiosBaseURL from "../Utility/axios";
import HowItWorks from "../components/How it works/Howitworks";

export const AppState = createContext();

const RouterApp = () => {

  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function checkUser() {
    try {
      const { data } = await axiosBaseURL.get("/users/check", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.log(error.response);
      navigate("/auth");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkUser();
    }
  }, []); // This runs once on mount

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogin = async (userData) => {
    localStorage.setItem("token", userData.token);
    await checkUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <AppState.Provider value={{ user, isLoggedIn, handleLogout, handleLogin }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/questions/ask" element={<Question />} />
        <Route
          path="/questions/getQuestions/:questionid"
          element={<Question />}
        />
        <Route path="/getQuestions/:questionid" element={<Answer />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppState.Provider>
  );
}

export default RouterApp;
