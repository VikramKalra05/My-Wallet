import { Navigate, Outlet, Link } from 'react-router-dom';
import '../css/privateRoutes.css';
import { useState, useEffect } from 'react';
import { TESTING_URL } from '../ApiLinks';

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Default to null (unknown state)
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${TESTING_URL}/auth/verify`, {
          method: 'GET',
          credentials: 'include',  // Important to send cookies with request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setTimeout(() => {
            setShouldRedirect(true);
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setTimeout(() => {
          setShouldRedirect(true);
        }, 5000);
      }
    };

    checkAuth();
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated === null) {
    return (
      <div className="state-block" role="status">
        <div className="spinner" />
        <p className="state-block__title">Please wait…</p>
      </div>
    );
  }

  // If authenticated, render child routes using Outlet
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Show modal while waiting to redirect
  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-required-title"
      >
        <h2 id="auth-required-title" className="modal-title">
          Authentication Required
        </h2>
        <p>Please log in to access this page.</p>
        <p className="modal-hint">Redirecting to login page...</p>
        <Link to="/login" className="btn btn--primary">
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default PrivateRoutes;
