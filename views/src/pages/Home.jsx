import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/home.module.css";

const FEATURES = [
  {
    title: "Track spending",
    text: "Log income and expenses in seconds, sorted into clear categories.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 20v-7" />
        <path d="M12 20V5" />
        <path d="M18 20v-10" />
      </svg>
    ),
  },
  {
    title: "See insights",
    text: "Simple charts that show where your money actually goes each month.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Stay in control",
    text: "Budgets and goals that keep your finances on track, month after month.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={`app-container ${styles.inner}`}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            TRACK<span className={styles.dot}>.</span>MANAGE
            <span className={styles.dot}>.</span>GROW
          </h1>
          <p className={styles.heroSubtitle}>
            From daily spending to long-term goals, we’ve got you covered.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className="btn btn--primary btn--lg">
              Get Started
            </Link>
          </div>
        </section>

        <section className={styles.featureRow} aria-label="Why My Wallet">
          {FEATURES.map((feature) => (
            <div className={`card ${styles.featureCard}`} key={feature.title}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
