import { useState, useEffect } from "react";
import AccountCard from "../components/AccountCard"
import styles from "../css/accounts.module.css"
import { getAccounts } from "../utils/accountUtils";
import AddAccountModal from "../components/AddAccountModal";
import { Skeleton } from "@mui/material";

const Accounts = () => {
    const [showAddAccountModal, setShowAddAccountModal] = useState(false)
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await getAccounts();
            if (res?.accounts) {
                setAccounts(res.accounts);
                setError("");
            } else {
                setError("Something went wrong fetching accounts.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch accounts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const renderSkeletons = () => {
        return Array(8)
            .fill()
            .map((_, index) => (
                <div key={index} className={styles.accountSkeleton}>
                    <Skeleton variant="rounded" width={280} height={100} animation="wave"/>
                </div>
            ));
    };

    return (
        <div className={styles.accounts}>
            {/* <div className={styles.accountHeader}>
                <h2>Accounts</h2>
            </div> */}
            <div className={styles.accountsContainer}>
                <div className={styles.accountsForm}>
                    <p  style={{textAlign:"center"}}>Create new account</p>
                    <div style={{
                        margin: "auto"
                    }}>
                        <button className={styles.formbutton} onClick={() => setShowAddAccountModal(true)}>Add Account</button>
                    </div>
                    {showAddAccountModal && <AddAccountModal accounts={accounts} setAccounts={setAccounts} showAddAccountModal={showAddAccountModal} setShowAddAccountModal={setShowAddAccountModal} />}
                </div>
                <div className={styles.accountsList}>
                    {loading && renderSkeletons()}

                    {!loading && error && (
                        <div className={styles.errorMsg}>{error}</div>
                    )}

                    {!loading && !error && accounts?.length === 0 && (
                        <div className={styles.noAccountsMsg}>No accounts found 🫥</div>
                    )}

                    {/* map accounts */}
                    {!loading &&
                        !error &&
                        accounts?.map((account, id) => (
                            <AccountCard
                                key={id}
                                account={account}
                                fetchAccounts={fetchAccounts}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Accounts