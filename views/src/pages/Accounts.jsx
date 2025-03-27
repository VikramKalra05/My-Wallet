import { useState, useEffect } from "react";
import AccountCard from "../components/AccountCard"
import styles from "../css/accounts.module.css"
import { createAccount } from "../utils/accountUtils";
import { getAccounts } from "../utils/accountUtils";
import AddAccountModal from "../components/AddAccountModal";

const Accounts = () => {
    const [showAddAccountModal, setShowAddAccountModal] = useState(false)
    const [accounts, setAccounts] = useState([]);

    // implement handle fetch account 
    // update the accounts state array
    // useEffect to fetch accounts on component mount

    const fetchAccounts = async () => {
        const accounts = await getAccounts();
        setAccounts(accounts?.accounts);
    }

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);   
    
    
    return(
        <div className={styles.accounts}>
            {/* <div className={styles.accountHeader}>
                <h2>Accounts</h2>
            </div> */}
            <div className={styles.accountsContainer}>
                <div className={styles.accountsList}>
                    {/* map accounts */}
                    {accounts?.map((account, id) => (
                        <AccountCard key={id} account={account} fetchAccounts={fetchAccounts} />
                    ))}
                </div>
                <div className={styles.accountsForm}>
                    <button onClick={() => setShowAddAccountModal(true)}>Add Account</button>
                    {showAddAccountModal && <AddAccountModal accounts={accounts} setAccounts={setAccounts} showAddAccountModal={showAddAccountModal} setShowAddAccountModal={setShowAddAccountModal} />}
                </div>
            </div>

        </div>
    )
}
export default Accounts