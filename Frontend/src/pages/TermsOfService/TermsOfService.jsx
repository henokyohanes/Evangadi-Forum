import React from "react";
import Layout from "../../Components/Layout/Layout";
import Styles from "./TermsOfService.module.css";

const TermsOfService = () => {
    return (
        <Layout>
            <div className={Styles.termsContainer}>
                <h1>Terms of Service</h1>
                <p>Effective April 1, 2025.</p>
                <p>
                    Welcome to <strong>Evangadi Forum</strong>. These Terms of Service
                    govern your access to and use of our website located at{" "}
                    <a href="https://qa-forum.henokyohanes.com/" target="_blank">
                        https://qa-forum.henokyohanes.com
                    </a>{" "}
                    and any related services. By accessing
                    or using the Site, you agree to be bound by these Terms.
                </p>
                <div className={Styles.sectionContainer}>
                    <h2>Eligibility</h2>
                    <p>
                        You must be at least 13 years old to use our Services. By using the
                        Site, you represent and warrant that you meet this requirement and
                        that the information you provide is accurate and complete.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Account Creation</h2>
                    <p>
                        To post questions or answers, you may need to create an account. You
                        are responsible for maintaining the confidentiality of your account
                        and password and for all activities that occur under your account.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Posting Content</h2>
                    <p>
                        You retain ownership of the content you post. However, by posting on
                        Evangadi Forum, you grant us a non-exclusive, royalty-free license
                        to use, store, display, and distribute your content.
                    </p>
                    <p>You agree not to post any content that is:</p>
                    <ul>
                        <li>Inaccurate, misleading, or false</li>
                        <li>Hateful, abusive, or discriminatory</li>
                        <li>Spam or unauthorized promotions</li>
                        <li>A violation of someone’s rights or the law</li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Prohibited Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Site for unlawful purposes</li>
                        <li>Disrupt the Site’s functionality</li>
                        <li>Access accounts or systems without authorization</li>
                        <li>Scrape or use bots to collect data without permission</li>
                    </ul>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Ownership of Content</h2>
                    <p>
                        All non-user content, such as text, graphics, and software, is the
                        property of Evangadi Forum and protected by intellectual property
                        laws.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your account at any
                        time without notice for any conduct that violates these Terms.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Disclaimer of Warranties</h2>
                    <p>
                        The content on Evangadi Forum is for informational purposes only. We
                        do not guarantee its accuracy or completeness. Use the Site at your
                        own risk.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, Evangadi Forum is not liable
                        for indirect or consequential damages from your use of the Site.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. Continued use of the
                        Site after changes are made constitutes acceptance of the new Terms.
                    </p>
                </div>
                <div className={Styles.sectionContainer}>
                    <h2>Contact Us</h2>
                    <p>If you have questions, contact us at:</p>
                    <ul className={Styles.contactList}>
                        <li>
                            📧 {" "}
                            <a href="mailto: support@evangadi.com" target="_blank">
                                support@evangadi.com
                            </a>
                        </li>
                        <li>
                            🌐{" "}
                            <a href="https://qa-forum.henokyohanes.com" target="_blank">
                                https://qa-forum.henokyohanes.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;