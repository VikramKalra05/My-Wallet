import { useState } from "react";
import styles from "../css/accounts.module.css"
import { createAccount } from "../utils/accountUtils";

const AddAccountModal = ({accounts, setAccounts, showAddAccountModal, setShowAddAccountModal}) => {
    const [newAccountDetails, setNewAccountDetails] = useState({
        accountName: "",
        balance: null
    })
    // implement add account
    // create a form to add account - account name and balance
    // And use this Modal in Accounts page
    // open this modal on click of add account button in Accounts page
    // take help of Accounts page for create functionality
    const handleCreate = async () => {
        if(!newAccountDetails){
            return;
        }

        try {
            const newAccount = await createAccount(newAccountDetails);
            console.log(newAccount)
            if(newAccount){
                setAccounts([...accounts, newAccount]);
                setNewAccountDetails({
                    accountName: "",
                    balance: 0
                })
                setShowAddAccountModal(false);
            }
        } catch (error) {
            alert("Something went wrong while creating new account");
        }
    }

    return (
        <div className={styles.AddAccountModalOverlay} onClick={() => setShowAddAccountModal(false)}>
            <div className={styles.AddAccountModalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Add Account</h2>
                <button onClick={() => setShowAddAccountModal(false)}>Close</button>
                <div>
                    <input type="text" placeholder="Account Name" value={newAccountDetails.accountName} onChange={(e) => setNewAccountDetails({ ...newAccountDetails, accountName: e.target.value })} />
                    <input type="number" placeholder="Account Balance" value={newAccountDetails.balance} onChange={(e) => setNewAccountDetails({ ...newAccountDetails, balance: e.target.value })} />
                    <button onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default AddAccountModal;