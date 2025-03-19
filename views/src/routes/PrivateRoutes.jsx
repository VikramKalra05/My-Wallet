import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';
import '../css/privateRoutes.css';
import { useState, useEffect } from 'react';
import { TESTING_URL } from '../ApiLinks';

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Default to null (unknown state)
  const [showModal, setShowModal] = useState(false);
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
          setShowModal(true);
          setTimeout(() => {
            setShouldRedirect(true);
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setShowModal(true);
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
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Please wait...</p>
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
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to access this page.</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default PrivateRoutes;