import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import WALLETLOGO from "../assets/walletLogo.svg";
import styles from "../css/navbar.module.css";
import { FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";
import AddRecords from "./AddRecords";

const profileColors = [
  "#ff3b30",
  "#ff9500",
  "#5856d6",
  "#30b0c7",
  "#af52de",
  "#ff2d55",
  "#34c759",
  "#007aff",
];

const Navbar = () => {
  const { addRecords, setAddRecords } = useContext(AppContext);
  const {   userDetails } = useContext(AuthContext);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileRandomColor, setProfileRandomColor] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (profileRandomColor) {
      setProfileRandomColor(true);
    }
  }, [profileRandomColor])

  const handleCustomColor = (letter) => {
    const firstLetter = letter.toUpperCase();
    // Calculate an index based on the ASCII value of the first letter
    const index = firstLetter.charCodeAt(0) % profileColors.length;
    return profileColors[index];
  }

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
                    {
                      profileRandomColor && (
                        <div className={styles.icon}>
                          <div 
                            className={styles.profileIcon}
                            style={{
                              backgroundColor: handleCustomColor(userDetails?.name[0])
                            }}
                          >
                            {userDetails?.name[0]}
                          </div>
                        </div>
                      )
                    }
                    {!profileRandomColor && userDetails.photo && (
                      <div className={styles.icon}>
                        <img 
                          src={userDetails?.photo} 
                          onError={(e) => {
                            e.target.onerror = null;
                            setProfileRandomColor(true)
                          }}
                          alt="user" loading="lazy" />
                      </div>
                    )}
                    <p className={styles.profileName}>{userDetails?.name}</p>
                    <FaAngleDown />{" "}
                  </div>
                  {dropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/settings" className={`${styles.dropdownItem} ${styles.hoverDropdownBtn}`} onClick={() => setDropdownOpen(false)}>
                        Settings
                      </Link>
                    <Link to="/logout" className={`${styles.dropdownItem} ${styles.logoutBtn}`} onTouchMoveCapture={(e) => e.target.style.backgroundColor = "red"} onClick={() => setDropdownOpen(false)}>Logout</Link>
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
