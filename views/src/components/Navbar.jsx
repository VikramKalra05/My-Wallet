import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import WALLETLOGO from "../assets/walletLogo.svg";
import styles from "../css/navbar.module.css";
import { FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";
import AddRecords from "./AddRecords";

const Navbar = () => {
  const { addRecords, setAddRecords } = useContext(AppContext);
  const { userDetails } = useContext(AuthContext);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location.pathname]);

  return (
    showNav && (
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <img
              src={WALLETLOGO}
              alt="Wallet Logo"
              className={styles.logoImg}
            />
          </div>

        <div className={styles.links}>
          {isHomePage && !isAuthenticated ? (
            <>
              <Link to="/login" className={styles.link}>Login</Link>
              <Link to="/register" className={styles.link}>Register</Link>
            </>
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.link}>Dashboard</Link>
              <Link to="/accounts" className={styles.link}>Accounts</Link>
              <Link to="/records" className={styles.link}>Records</Link>
              <Link to="/analytics" className={styles.link}>Analytics</Link>
              <div>
                <button className={styles.button} onClick={() => setAddRecords(true)}>+ Record</button>
                {addRecords && <AddRecords />}
              </div>
              <div className={styles.profileSection}>
                  <div
                    className={styles.profileContainer}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className={styles.icon}>
                      <img src={userDetails?.photo} alt="user" loading="lazy" />
                    </div>
                    <p className={styles.profileName}>{userDetails?.name}</p>
                    <FaAngleDown />{" "}
                  </div>
                  {dropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/settings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        Settings
                      </Link>
                      <button className={styles.logout}>LOGOUT</button>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
