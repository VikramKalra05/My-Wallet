import React, { useState } from "react";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg";
import PASSWORDICON from "../assets/passwordIcon.svg";
import WALLETLOGO from "../assets/walletLogo.svg";
import { loginUser } from "../utils/userUtils";

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

  const handleLoginUser = async () => {
    if(!userFormDetails){
      console.log("Fill in the details")
      return;
    }

    // try {
      
    // } catch (error) {
      
      
      const res = await loginUser(userFormDetails);
      
      if(res?.token){
        console.log("Login Successful")
        alert("Login Successful");
        
      }else{
        // console.log("error aeee", res);
        alert("Login Failed")
      }
    // }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLogo}>
        <img src={WALLETLOGO} alt="logo" />
      </div>
      <div className={styles.loginBoxOuter}>
        <div className={styles.loginHeader}>
          <p className={styles.loginTitle}>Welcome Back</p>
          <p className={styles.loginSubtitle}>
            Enter your credentials to access your account.
          </p>
        </div>
        <div className={styles.loginBox}>
          <div className={styles.inputBoxes}>
            <img src={EMAILICON} alt="email" id={styles.emailIcon} />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={userFormDetails.email}
              onChange={(e) => handleUserDetails(e)}
            />
          </div>
          <div className={styles.inputBoxes}>
            <img src={PASSWORDICON} alt="email" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={userFormDetails.password}
              onChange={(e) => handleUserDetails(e)}
            />
          </div>
          {/* <div className={styles.forgetPassBtn}>
            <p>Forgot Password?</p>
          </div> */}
          <button 
            className={`${styles.loginBtn} ${styles.disabledBtn}`}
            onClick={handleLoginUser}  
          >Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
