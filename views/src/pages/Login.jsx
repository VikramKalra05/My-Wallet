import React, { useState } from "react";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg"

const Login = () => {
  const [userFormDetails, setUserFormDetails] = useState({
    email: "",
    password: "",
  });

  const handleUserDetails = (e) => {
    setUserFormDetails({
        ...userFormDetails, 
        [e.target.name]: e.target.value,
      });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLogo}>logo</div>
      <div className={styles.loginBoxOuter}>
        <div className={styles.loginHeader}>
          <p className={styles.loginTitle}>Welcome Back</p>
          <p className={styles.loginSubtitle}>
            Enter your credentials to access your account.
          </p>
        </div>
        <div className={styles.loginBox}>
          <div>
            <img src={EMAILICON} alt="email" />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={userFormDetails.email}
              onChange={(e) => handleUserDetails(e)}
            />
          </div>
          <div>
            <img src={EMAILICON} alt="email" />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={userFormDetails.email}
              onChange={(e) => handleUserDetails(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
