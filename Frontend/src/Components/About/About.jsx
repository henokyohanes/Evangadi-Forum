import React from "react";
import styles from "./About.module.css";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleHowItWorksClick = () => { 
    navigate("/how-it-works");
  };

  return (
    <div className={styles.container}>
      <p className={styles.link}>About</p>
      <h1>Evangadi Networks</h1>
      <p className={styles.text}>
        No matter what stage of life you are in, whether you’re just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.
      </p>
      <p className={styles.text}>
        Whether you are willing to share your knowledge or you are just looking
        to meet mentors of your own, please start by joining the network here.
      </p>
      <button className={styles.button} onClick={handleHowItWorksClick}>
        HOW IT WORKS
      </button>
    </div>
  );
};

export default About;