import React from "react";
import { Link } from "react-router-dom";

const BlankPage = () => {
  return (
    <div className="page" style={{ backgroundColor: "var(--bg)" }}>
      <div className="app-container">
        <div className="card">
          <div className="state-block">
            <span
              className="state-block__icon"
              style={{ color: "var(--brand)" }}
              aria-hidden="true"
            >
              404
            </span>
            <h1 className="state-block__title">Page not found</h1>
            <p className="state-block__text">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link to="/dashboard" className="btn btn--primary">
              Back to dashboard
            </Link>
            <Link to="/" className="btn btn--ghost">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
