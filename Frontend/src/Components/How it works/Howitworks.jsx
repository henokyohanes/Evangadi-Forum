import React from "react";
import styles from "./HowItWorks.module.css";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

const HowItWorks = () => (
  <Layout>
    <div className={styles.howItWorks}>
      <h1>How It Works</h1>

      {/* First Section: Text on left, Image on right */}
      <div className={`${styles.section} ${styles.sectionLeft}`}>
        <div className={styles.text}>
          <h2>Create an Account or Log In</h2>
          <p style={{ textAlign: "left" }}>
            To use the platform, you need to either create an account or log in
            if you already have one.
            <ul>
              <li>Click on the Sign-Up option if you&apos;re new.</li>
              <li>
                Fill in your first name, last name, username, email, and
                password (minimum 8 characters).
              </li>
              <li>
                If you already have an account, just provide your email and
                password to log in.
              </li>
            </ul>
          </p>
        </div>
        <div className={styles.image}>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-illustration-download-in-svg-png-gif-file-formats--log-register-form-user-interface-pack-design-development-illustrations-6430773.png?f=webp"
            alt="Create Account or Log In"
            style={{ width: "400px" }}
            loading="lazy"
          />
        </div>
      </div>
      {/* Second Section: Image on left, Text on right */}
      <div className={`${styles.section} ${styles.sectionRight}`}>
        <div className={styles.image}>
          <img
            src="https://img.freepik.com/free-vector/organic-flat-people-asking-questions_23-2148896826.jpg"
            alt="Ask a Question"
            style={{ width: "400px" }}
            loading="lazy"
          />
        </div>
        <div className={styles.text}>
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
      {/* Third Section: Text on left, Image on right */}
      <div className={`${styles.section} ${styles.sectionLeft}`}>
        <div className={styles.text}>
          <h2>Answer a Question</h2>
          <p>
            To answer a question, click on a question’s title to view the
            details and answers. You can provide your answer in the answer box
            and click &quot;Post&quot; to submit it.
          </p>
        </div>
        <div className={styles.image}>
          <img
            src="https://www.shutterstock.com/image-vector/perplexed-characters-standing-huge-question-600nw-2320644731.jpg"
            alt="Answer a Question"
            style={{ width: "400px" }}
            loading="lazy"
          />
        </div>
      </div>
      {/* Fourth Section: Image on left, Text on right */}
      <div className={`${styles.section} ${styles.sectionRight}`}>
        <div className={styles.image}>
          <img
            src="https://www.epicshops.com/wp-content/uploads/2019/06/website-navigation-bar-header.jpg"
            alt="Navigation"
            loading="lazy"
          />
        </div>
        <div className={styles.text}>
          <h2>Navigation</h2>
          <p>
            You can navigate back to the homepage from any page and log out if
            you wish. This platform is responsive and accessible from any
            device.
          </p>
        </div>
      </div>
    </div>

    <div className={styles.suggestion_button}>
      <h1>Ready to Sign Up?</h1>
      <Link to="/auth">
        <button>Sign Up</button>
      </Link>
    </div>
  </Layout>
);

export default HowItWorks;
