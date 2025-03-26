import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WALLETLOGO from "../assets/walletLogo.svg"
import styles from "../css/navbar.module.css"
import { FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";
import AddRecords from "./AddRecords";


const Navbar = () => {
  const {addRecords, setAddRecords}=useContext(AppContext)
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dropdownOpen , setDropdownOpen]=useState(false)
  

  const isHomePage = location.pathname === "/";

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={WALLETLOGO} alt="Wallet Logo" className={styles.logoImg} />
      </div>

      <div className={styles.links}>
        {isHomePage ? (
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
            <button className={styles.button} onClick={()=>setAddRecords(true)}>+ Record</button>
            {addRecords && <AddRecords />}
            </div>
            <div className={styles.profileSection}>
              <div className={styles.profileName} onClick={()=>setDropdownOpen(!dropdownOpen)}>Shruti Gupta <FaAngleDown /> </div>
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/settings" className={styles.dropdownItem}>Settings</Link>
              </div>
            )}
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;

