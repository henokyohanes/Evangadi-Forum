import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import image1 from "../../assets/Images/6430773.jpg";
import image2 from "../../assets/Images/6430774.jpg";
import image3 from "../../assets/Images/6430775.jpg";
import image4 from "../../assets/Images/6430776.jpg";
import styles from "./HowItWorks.module.css";

const HowItWork = () => (
  <Layout>
    <div className={styles.howItWorks}>
      <h1>How It Works</h1>
      {/* First Section: Text on left, Image on right */}
      <div className={`${styles.section} row`}>
        <div className={`${styles.text} col-12 col-md-6`}>
          <h2>Create an Account or Log In</h2>
          <p>
            To use the platform, you need to either create an account or log in
            if you already have one.
            <ul>
              <li>Click on the Sign-Up option if you&apos;re new.</li>
              <li>
                Fill in your first name, last name, username, email, and
                password.
              </li>
              <li>
                If you already have an account, just provide your email and
                password to log in.
              </li>
            </ul>
          </p>
        </div>
        <div className={`${styles.image} col-12 col-md-6`}>
          <img src={image1} alt="Create Account" loading="lazy" />
        </div>
      </div>
      <div className={`${styles.divider}`}></div>
      {/* Second Section: Image on left, Text on right */}
      <div className={`${styles.section} row`}>
        <div className={`${styles.image} col-12 col-md-6 mb-3`}>
          <img src={image2} alt="Ask a Question" loading="lazy" />
        </div>
        <div className={`${styles.text} col-12 col-md-6`}>
          <h2>Ask a Question</h2>
          <p>
            After logging in, you’ll be taken to the Questions Page where you
            can view or post questions.
            <ul>
              <li>
                Click on &quot;Ask a Question&quot; and fill out the title and
                description.
              </li>
              <li>Summarize your problem in a short title (max 200 words).</li>
              <li>Click &quot;Post&quot; to submit your question.</li>
            </ul>
          </p>
        </div>
      </div>
      <div className={`${styles.divider}`}></div>
      {/* Third Section: Text on left, Image on right */}
      <div className={`${styles.section} row`}>
        <div className={`${styles.text} col-12 col-md-6`}>
          <h2>Answer a Question</h2>
          <p>
            To answer a question, click on a question’s title to view the
            details and answers. You can provide your answer in the answer box
            and click &quot;Post&quot; to submit it.
          </p>
        </div>
        <div className={`${styles.image} col-12 col-md-6`}>
          <img src={image3} alt="Answer a Question" loading="lazy" />
        </div>
      </div>
      <div className={`${styles.divider}`}></div>
      {/* Fourth Section: Image on left, Text on right */}
      <div className={`${styles.section} row`}>
        <div className={`${styles.image} col-12 col-md-6 mb-3`}>
          <img src={image4} alt="Navigation" loading="lazy" />
        </div>
        <div className={`${styles.text} col-12 col-md-6`}>
          <h2>Navigation</h2>
          <p>
            You can navigate back to the homepage from any page and log out if
            you wish. This platform is responsive and accessible from any
            device.
          </p>
        </div>
      </div>
      <div className={styles.suggestion}>
        <h1>Ready to Sign Up?</h1>
        <Link to="/">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  </Layout>
);

export default HowItWork;