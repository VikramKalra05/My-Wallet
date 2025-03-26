import React from "react";
import styles from "../css/home.module.css";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate()

  navigate("/register");

  return (
    <div>
     
      <div className={styles.homeTitle}>My Wallet - A Smarter Way To Track Finances</div>
      <p>Work in progress...</p>

    </div>
  );
};

export default Home;
