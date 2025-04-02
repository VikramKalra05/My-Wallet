import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg";
import PASSWORDICON from "../assets/passwordIcon.svg";
import WALLETLOGO from "../assets/walletLogo.svg";
import GOOGLEICON from "../assets/Login-Page/googleIcon.png";
import LOADINGGIF from "../assets/Login-Page/loadingAnimation.gif";
// import LOGINLEFTHALFIMG from "../assets/Login-Page/loginLeftHalfImage.svg";
import { loginUser } from "../utils/userUtils";
import { TESTING_URL } from "../ApiLinks";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userFormDetails, setUserFormDetails] = useState({
    email: "",
    password: "",
  });
  const {isAuthenticated}=useAuth();

  const handleUserDetails = (e) => {
    setUserFormDetails({
      ...userFormDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginUser = async () => {
    if (!userFormDetails) {
      console.log("Fill in the details");
      return;
    }
    
    setLoading(true);

    const res = await loginUser(userFormDetails);

    window.localStorage.setItem("token", res?.token);

    if (res?.token) {
      console.log("Login Successful");
      navigate("/dashboard");
    } else {
      alert("Login Failed");
    }
    setLoading(false);
  };

  if(isAuthenticated){
    navigate("/dashboard")
  }

  const handleEmailFocus = () => {
    emailInputRef.current?.focus();
  };

  const handlePasswordFocus = () => {
    passwordInputRef.current?.focus();
  };

  const handleGoogleSignIn = () => {
    window.location = `${TESTING_URL}/auth/google`;
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLogo}>
        <img src={WALLETLOGO} alt="logo" />
      </div>
      <div className={styles.loginRightHalf}>
        <div className={styles.loginBoxOuter}>
          <div className={styles.loginHeader}>
            <p className={styles.loginTitle}>Welcome Back</p>
            <p className={styles.loginSubtitle}>
              Enter your credentials to access your account.
            </p>
          </div>
          <div className={styles.loginBox}>
            <div className={styles.inputBoxes} onClick={handleEmailFocus}>
              <img src={EMAILICON} alt="email" id={styles.emailIcon} />
              <input
                type="text"
                name="email"
                ref={emailInputRef}
                placeholder="Enter your email"
                value={userFormDetails.email}
                onChange={(e) => handleUserDetails(e)}
              />
            </div>
            <div className={styles.inputBoxes} onClick={handlePasswordFocus}>
              <img src={PASSWORDICON} alt="email" />
              <input
                ref={passwordInputRef}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={userFormDetails.password}
                onChange={(e) => handleUserDetails(e)}
                onKeyDown={(e) => {
                  if(e.key === "Enter"){
                    handleLoginUser();
                  }
                }}
              />
            </div>
            {/* <div className={styles.forgetPassBtn}>
              <p>Forgot Password?</p>
            </div> */}
            {loading ? (
              <div className={styles.loadingDiv}>
                <img src={LOADINGGIF} alt="" />
              </div>
            ) : (
              <button
                className={`${styles.loginBtn} ${styles.disabledBtn}`}
                onClick={handleLoginUser}
              >
                Sign in
              </button>
            )}
            <div className={styles.orText}>
              <p>or</p>
            </div>
            <button
              className={`${styles.googleSignInBtn} ${styles.disabledBtn}`}
              onClick={handleGoogleSignIn}
            >
              <div>
                <img src={GOOGLEICON} alt="" className={styles.googleIcon} />
                Sign in with Google
              </div>
            </button>
          </div>
          <div className={styles.navigateToLoginPage}>
            <p>
              New here? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
