import React, { createContext, useContext, useState, useEffect } from 'react';
import { TESTING_URL } from '../ApiLinks';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    // Function to check auth
    const verifyAuth = async () => {
        try {
            const response = await fetch(`${TESTING_URL}/auth/verify`, {
                method: 'GET',
                credentials: 'include',
            });

            setIsAuthenticated(response.ok); // true if 200, false otherwise
        } catch (error) {
            console.error('Auth verification failed:', error);
            setIsAuthenticated(false);
        }
    };

    // Verify on app load
    useEffect(() => {
        verifyAuth();

        // Re-verify every 15 minutes
        const interval = setInterval(() => {
            verifyAuth();
        }, 15 * 60 * 1000);  // 15 minutes in milliseconds

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth
export const useAuth = () => useContext(AuthContext);
