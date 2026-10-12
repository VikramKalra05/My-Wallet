import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WALLETLOGO from "../assets/walletLogo.svg";
import styles from "../css/navbar.module.css";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import AppContext from "../context/AppContext";
import AddRecords from "./AddRecords";

const profileColors = [
  "#0b7f74",
  "#1163d6",
  "#8b5cf6",
  "#db2777",
  "#ea580c",
  "#15803d",
  "#0891b2",
  "#b45309",
];

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/records", label: "Records" },
  { to: "/analytics", label: "Analytics" },
];

const Navbar = () => {
  const { addRecords, setAddRecords } = useContext(AppContext);
  const { userDetails, isAuthenticated } = useAuth();
  const user = userDetails;

  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const profileRef = useRef(null);

  const showNav = !["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const displayName = user?.name || "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";
  const avatarColor =
    profileColors[(initial.charCodeAt(0) || 0) % profileColors.length];

  if (!showNav) return null;

  return (
    <>
      <nav className={styles.navbar} aria-label="Main">
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <img
              src={WALLETLOGO}
              alt=""
              className={styles.logoImg}
              aria-hidden="true"
            />
            <p className={styles.logoText}>My Wallet</p>
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="main-nav-links"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          <div
            id="main-nav-links"
            className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
          >
            {isAuthenticated ? (
              <>
                {NAV_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`${styles.link} ${
                      location.pathname === to ? styles.linkActive : ""
                    }`}
                    aria-current={
                      location.pathname === to ? "page" : undefined
                    }
                  >
                    {label}
                  </Link>
                ))}
                <div>
                  <button
                    type="button"
                    className={`btn btn--primary ${styles.button}`}
                    onClick={() => setAddRecords(true)}
                  >
                    + Record
                  </button>
                </div>
                <div className={styles.profileSection} ref={profileRef}>
                  <button
                    type="button"
                    className={styles.profileContainer}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    {user?.photo && !photoFailed ? (
                      <span className={styles.icon}>
                        <img
                          src={user.photo}
                          onError={() => setPhotoFailed(true)}
                          alt=""
                        />
                      </span>
                    ) : (
                      <span
                        className={styles.profileIcon}
                        style={{ backgroundColor: avatarColor }}
                        aria-hidden="true"
                      >
                        {initial}
                      </span>
                    )}
                    <p className={styles.profileName}>{displayName}</p>
                    <FaAngleDown
                      className={`${styles.chevron} ${
                        dropdownOpen ? styles.chevronOpen : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className={styles.dropdownMenu} role="menu">
                      <Link
                        to="/settings"
                        role="menuitem"
                        className={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiSettings aria-hidden="true" /> Settings
                      </Link>
                      <Link
                        to="/logout"
                        role="menuitem"
                        className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiLogOut aria-hidden="true" /> Logout
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
                <Link to="/register" className={styles.link}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {addRecords && <AddRecords />}
    </>
  );
};

export default Navbar;
