import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { createContext } from "react";
import Question from "../pages/Question/Question";
import Answer from "../pages/Answer/Answer";
import Home from "../pages/Home/Home";
import NotFound from "../Components/NotFound/NotFound";
import Auth from "../pages/Auth/Auth";
import axiosBaseURL from "../Utility/axios";
import HowItWorks from "../pages/HowItWork/HowItWork";
import Account from "../pages/Account/Account";

export const AppState = createContext();

const RouterApp = () => {

  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function checkUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axiosBaseURL.get("/users/check", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkUser();
    }
  }, []);

  const handleLogin = async (userData) => {
    localStorage.setItem("token", userData.token);
    await checkUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/auth");
  };

  const isLoggedIn = !!user.userid;

  return (
    <AppState.Provider value={{ user, setUser, isLoggedIn, handleLogout, handleLogin }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/questions/ask" element={<Question />} />
        <Route path="/questions/getQuestions/:questionid" element={<Question />}/>
        <Route path="/getQuestions/:questionid" element={<Answer />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppState.Provider>
  );
}

export default RouterApp;