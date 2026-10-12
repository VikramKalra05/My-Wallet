import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/logout.module.css"
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../utils/userUtils";
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const { setUserDetails, setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate();
    const retryTimeout = useRef(null);
    const countdownInterval = useRef(null);
    const attemptsRef = useRef(0);
    
    const [retrying, setRetrying] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const MAX_ATTEMPTS = 3;

    const clearTimers = () => {
        clearTimeout(retryTimeout.current);
        clearInterval(countdownInterval.current);
    };

    const finishLogout = () => {
        clearTimers();
        setUserDetails({});
        setIsAuthenticated(false);
        navigate("/");
    };

    const handleLogout = async () => {
        const res = await logoutUser();

        // Either the server logged us out, or the token is already dead
        // (401) / the network failed. Clear local state either way after a
        // couple of retries instead of looping forever.
        if (res || attemptsRef.current >= MAX_ATTEMPTS - 1) {
            finishLogout();
            return;
        }

        attemptsRef.current += 1;
        setRetrying(true);
        setCountdown(5);
        clearInterval(countdownInterval.current);
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Retry logout after 5 seconds
        retryTimeout.current = setTimeout(() => {
            handleLogout();
        }, 5000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleLogout();
        }, 3000); // 3 seconds delay

        return () => {
            clearTimeout(timer);
            clearTimers();
        };
    }, [])

    return (
        <div className={styles.logoutPage}>
            <h1>Logging you out...</h1>
            {retrying && countdown > 0 && (
                <p>Retrying in {countdown}...</p>
            )}
        </div>
    );
};


export default Logout;