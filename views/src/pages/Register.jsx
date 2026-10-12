import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg";
import PASSWORDICON from "../assets/passwordIcon.svg";
import WALLETLOGO from "../assets/walletLogo.svg";
import GOOGLEICON from "../assets/Login-Page/googleIcon.png";
import USERICON from "../assets/Register-Page/userIcon.svg";
import { registerUser } from "../utils/userUtils";
import { TESTING_URL } from "../ApiLinks";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userFormDetails, setUserFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const { isAuthenticated } = useAuth();

  const handleUserDetails = (e) => {
    setUserFormDetails({
      ...userFormDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !userFormDetails.name.trim() ||
      !userFormDetails.email.trim() ||
      !userFormDetails.password ||
      !userFormDetails.confirmedPassword
    ) {
      setError("Please fill in all the fields");
      return;
    }

    if (userFormDetails.password !== userFormDetails.confirmedPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await registerUser(userFormDetails);

    if (res?.msg === "User has been registered") {
      // Register does not create a session, so send the user to login
      // instead of /dashboard (which would bounce them back here).
      navigate("/login", {
        state: { notice: "Registered successfully. Please log in." },
      });
      return;
    }
    setError(res?.msg || res?.err || "Register Failed");
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = () => {
    window.location = `${TESTING_URL}/auth/google`;
  };

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginCard}>
        <header className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <img src={WALLETLOGO} alt="My Wallet" />
          </div>
          <h1 className={styles.loginTitle}>Register</h1>
          <p className={styles.loginSubtitle}>
            Register now to take control of your wallet.
          </p>
        </header>

        <form className={styles.loginForm} onSubmit={handleRegisterUser} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="register-name">
              Name
            </label>
            <div className={styles.inputWrap}>
              <img src={USERICON} alt="" className={styles.inputIcon} />
              <input
                id="register-name"
                className={`field__input ${styles.inputWithIcon}`}
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Enter your name"
                value={userFormDetails.name}
                onChange={handleUserDetails}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="register-email">
              Email
            </label>
            <div className={styles.inputWrap}>
              <img src={EMAILICON} alt="" className={styles.inputIcon} />
              <input
                id="register-email"
                className={`field__input ${styles.inputWithIcon}`}
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                value={userFormDetails.email}
                onChange={handleUserDetails}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="register-password">
              Password
            </label>
            <div className={styles.inputWrap}>
              <img src={PASSWORDICON} alt="" className={styles.inputIcon} />
              <input
                id="register-password"
                className={`field__input ${styles.inputWithIcon}`}
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Enter your password"
                value={userFormDetails.password}
                onChange={handleUserDetails}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="register-confirm-password">
              Confirm password
            </label>
            <div className={styles.inputWrap}>
              <img src={PASSWORDICON} alt="" className={styles.inputIcon} />
              <input
                id="register-confirm-password"
                className={`field__input ${styles.inputWithIcon}`}
                type="password"
                name="confirmedPassword"
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={userFormDetails.confirmedPassword}
                onChange={handleUserDetails}
              />
            </div>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn--primary btn--block ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <div className={styles.orText} aria-hidden="true">
            <span>or</span>
          </div>

          <button
            type="button"
            className={`btn btn--secondary btn--block ${styles.googleBtn}`}
            onClick={handleGoogleSignIn}
          >
            <img src={GOOGLEICON} alt="" className={styles.googleIcon} />
            Sign up with Google
          </button>
        </form>

        <p className={styles.loginFooter}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
