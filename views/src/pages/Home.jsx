import React from "react";
import styles from "../css/home.module.css";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate()

  // navigate("/register");

  return (
    <div className={styles.homePage}>
      <div className={styles.homeHeader}>
        <p className={styles.homeHeadingTitle}>TRACK.MANAGE.GROW</p>
        <p className={styles.homeHeadingDesc}>From daily spending to long-term goals, 
        we’ve got you covered.</p>
        <button className={styles.homeBtn} onClick={() => navigate("/register")}>Get Started</button>
      </div>
    </div>
  );
};

export default Home;
