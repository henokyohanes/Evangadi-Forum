import React from "react";
import RouterApp from "./Routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";

const App = () => {
  return (
    <>
      <RouterApp />
      <ToastContainer className="toast-container" toastClassName="toast-item" bodyClassName={"toast-body"} />
    </>
  );
}

export default App;
