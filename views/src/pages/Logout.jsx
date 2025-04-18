import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/logout.module.css"
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../utils/userUtils";
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const { userDetails, setUserDetails, setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate();
    const retryTimeout = useRef(null);
    const countdownInterval = useRef(null);
    
    const [retrying, setRetrying] = useState(false);
    const [countdown, setCountdown] = useState(3);


    // useEffect(() => {
    //     window.scrollTo(0, 0)
    // })

    const startCountdown = () => {
        setRetrying(true);
        setCountdown(3);
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current);
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleLogout = async () => {
        if (userDetails) {
            const res = await logoutUser()
            if (!res) {
                startCountdown();

                // Retry logout after 5 seconds
                retryTimeout.current = setTimeout(() => {
                    handleLogout();
                }, 5000);
                return;
            }else{
                setUserDetails({});
                setIsAuthenticated(false);
            }
        }
        navigate("/")
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleLogout();
        }, 3000); // 3 seconds delay

        return () => {
            clearTimeout(timer);
            clearTimeout(retryTimeout.current);
            clearInterval(countdownInterval.current);

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