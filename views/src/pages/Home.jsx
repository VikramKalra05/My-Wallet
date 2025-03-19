import React from "react";
import styles from "../css/home.module.css";
import {Link} from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className={styles.loginA}>
        <Link to="/login">Login Page</Link>
      </div>
      <div className={styles.loginA}>
        <Link to="/register">Register Page</Link>
      </div>
      <div className={styles.homeTitle}>My Wallet - A Smarter Way To Track Finances</div>
      <p>Work in progress...</p>

    </div>
  );
};

export default Home;
