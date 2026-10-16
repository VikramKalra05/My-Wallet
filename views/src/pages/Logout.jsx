import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/logout.module.css";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../utils/userUtils";

const INITIAL_DELAY_MS = 3000;
const RETRY_DELAY_MS = 3000;
const MAX_ATTEMPTS = 3;

const Logout = () => {
    const { setUserDetails, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const retryTimeout = useRef(null);
    const countdownInterval = useRef(null);
    const attemptsRef = useRef(0);

    const [retrying, setRetrying] = useState(false);
    const [countdown, setCountdown] = useState(3);

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
        // (401) / the network failed. Clear local state either way after
        // a couple of retries instead of looping forever.
        if (res || attemptsRef.current >= MAX_ATTEMPTS - 1) {
            finishLogout();
            return;
        }

        attemptsRef.current += 1;
        setRetrying(true);
        setCountdown(3);
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

        // Retry logout after a few seconds
        retryTimeout.current = setTimeout(() => {
            handleLogout();
        }, RETRY_DELAY_MS);
    };

    // Kick off the first logout attempt once; retries are driven by their own timers.
    useEffect(() => {
        const timer = setTimeout(() => {
            handleLogout();
        }, INITIAL_DELAY_MS);

        return () => {
            clearTimeout(timer);
            clearTimers();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.logoutPage}>
            <div className={`card ${styles.logoutCard}`}>
                <div className="state-block">
                    <div className="spinner" aria-hidden="true" />
                    <div className={styles.logoutStatus} role="status">
                        <h1 className="state-block__title">Signing you out…</h1>
                        {retrying && countdown > 0 && (
                            <p className="state-block__text">
                                Retrying in {countdown}…
                            </p>
                        )}
                    </div>
                    <Link to="/login" className="btn btn--secondary">
                        Go to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Logout;
