import { useContext, useEffect } from "react";
import styles from "../css/logout.module.css"
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
    const {userDetails} = useContext(AuthContext)

    useEffect(() => {
        window.scrollTo(0, 0)
    })

    return (
        <div className={styles.logoutPage}>
            <h1>Logout</h1>
        </div>
    );
}
export default Logout;