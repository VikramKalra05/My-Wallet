import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg";
import PASSWORDICON from "../assets/passwordIcon.svg";
import WALLETLOGO from "../assets/walletLogo.svg";
import GOOGLEICON from "../assets/Login-Page/googleIcon.png";
import LOADINGGIF from "../assets/Login-Page/loadingAnimation.gif";
import USERICON from "../assets/Register-Page/userIcon.svg";
// import LOGINLEFTHALFIMG from "../assets/Login-Page/loginLeftHalfImage.svg";
import { registerUser } from "../utils/userUtils";
import { TESTING_URL } from "../ApiLinks";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userFormDetails, setUserFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const {isAuthenticated}=useAuth()

  const handleUserDetails = (e) => {
    setUserFormDetails({
      ...userFormDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterUser = async () => {
    setLoading(true)
    if (!userFormDetails) {
      console.log("Fill in the details");
      setLoading(false);
      return;
    }
    
    if(userFormDetails.password !== userFormDetails.confirmedPassword){
      console.log("Fill in the same password");
      setLoading(false);
      return;
    }
    
    const res = await registerUser(userFormDetails);
    
    if (res?.msg === "User has been registered") {
      console.log("Register Successful");
      // setLoading(false);
      navigate("/dashboard")
      // alert("Login Successful");
    } else {
      // console.log("error aeee", res);
      alert("Register Failed");
    }
    setLoading(false);
    // }
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

  const handleConfirmPasswordFocus = () => {
    confirmPasswordInputRef.current?.focus();
  };

  const handleNameFocus = () => {
    nameInputRef.current?.focus();
  };

  const handleGoogleSignIn = () => {
    window.location = `${TESTING_URL}/auth/google`;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLogo}>
        <img src={WALLETLOGO} alt="logo" />
      </div>
      <div className={styles.loginRightHalf}>
        <div className={styles.loginBoxOuter}>
          <div className={styles.loginHeader}>
            <p className={styles.loginTitle}>Register</p>
            <p className={styles.loginSubtitle}>
            Register now to take control of your wallet.
            </p>
          </div>
          <div className={styles.loginBox}>
            <div className={styles.inputBoxes} onClick={handleNameFocus}>
              <img src={USERICON} alt="email" id={styles.emailIcon} />
              <input
                type="text"
                name="name"
                ref={nameInputRef}
                placeholder="Enter your name"
                value={userFormDetails.name}
                onChange={(e) => handleUserDetails(e)}
              />
            </div>
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
              />
            </div>
            <div className={styles.inputBoxes} onClick={handleConfirmPasswordFocus}>
              <img src={PASSWORDICON} alt="email" />
              <input
                ref={confirmPasswordInputRef}
                type="password"
                name="confirmedPassword"
                placeholder="Confirm your password"
                value={userFormDetails.confirmedPassword}
                onChange={(e) => handleUserDetails(e)}
                onKeyDown={(e) => {
                  if(e.key === "Enter"){
                    handleRegisterUser();
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
                onClick={handleRegisterUser}
              >
                Sign up
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
                Sign up with Google
              </div>
            </button>
          </div>
          <div className={styles.navigateToLoginPage}>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
