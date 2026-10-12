import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import EMAILICON from "../assets/emailIcon.svg";
import PASSWORDICON from "../assets/passwordIcon.svg";
import WALLETLOGO from "../assets/walletLogo.svg";
import GOOGLEICON from "../assets/Login-Page/googleIcon.png";
import { loginUser } from "../utils/userUtils";
import { TESTING_URL } from "../ApiLinks";
import { AuthContext, useAuth } from "../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // Register hands us a success note via navigation state.
  const [notice, setNotice] = useState(location.state?.notice || "");
  const [userFormDetails, setUserFormDetails] = useState({
    email: "",
    password: "",
  });
  const { isAuthenticated } = useAuth();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleUserDetails = (e) => {
    setNotice("");
    setUserFormDetails({
      ...userFormDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!userFormDetails.email.trim() || !userFormDetails.password) {
      setError("Fill in the details");
      return;
    }

    setLoading(true);

    const res = await loginUser(userFormDetails);

    if (res?.token) {
      window.localStorage.setItem("token", res.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      setError("Login Failed");
    }
    setLoading(false);
  };

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
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <p className={styles.loginSubtitle}>
            Enter your credentials to access your account.
          </p>
        </header>

        <form className={styles.loginForm} onSubmit={handleLoginUser} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="login-email">
              Email
            </label>
            <div className={styles.inputWrap}>
              <img src={EMAILICON} alt="" className={styles.inputIcon} />
              <input
                id="login-email"
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
            <label className="field__label" htmlFor="login-password">
              Password
            </label>
            <div className={styles.inputWrap}>
              <img src={PASSWORDICON} alt="" className={styles.inputIcon} />
              <input
                id="login-password"
                className={`field__input ${styles.inputWithIcon}`}
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={userFormDetails.password}
                onChange={handleUserDetails}
              />
            </div>
          </div>

          {notice && (
            <div className={styles.formNotice} role="status">
              {notice}
            </div>
          )}
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
            {loading ? "Signing in…" : "Sign in"}
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
            Sign in with Google
          </button>
        </form>

        <p className={styles.loginFooter}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
