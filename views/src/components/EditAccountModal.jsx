import { useState } from "react";
import { editAccount } from "../utils/accountUtils";
import styles from "../css/accounts.module.css";
import { RxCross2 } from "react-icons/rx";


const EditAccountModal = ({account, fetchAccounts, setShowEditAccountModal}) => {
 const [updatedAccount, setUpdatedAccount]=useState(account)   

    // implement edit account
    // create a form to edit account - account name and balance
    // 
    const handleEdit = async () => {
        try {
            await editAccount({ id: account._id, accountName: updatedAccount.accountName, balance: updatedAccount.balance });
            fetchAccounts();
            setShowEditAccountModal(false);
        } catch (error) {
            alert("Something went wrong while editing account");
        }
    } 

    return (
        <div className={styles.AddAccountModalOverlay} onClick={() => setShowEditAccountModal(false)}>
            <div className={styles.AddAccountModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.top}>
                <h2 style={{fontSize:"18px"}}>Edit Account</h2>
                <button className={styles.closeButton} onClick={() => setShowEditAccountModal(false)}><RxCross2 /></button>
                </div>
                <div className={styles.inputGroup}>
                    <label>Account Name</label>
                    <input type="text" placeholder="Enter Account Name" value={updatedAccount.accountName} onChange={(e) => setUpdatedAccount({ ...updatedAccount, accountName: e.target.value })} />
                    <label>Balance</label>
                    <input type="number" placeholder="Enter Balance" value={updatedAccount.balance} onChange={(e) => setUpdatedAccount({ ...updatedAccount, balance: e.target.value })} />
                    </div>
                    <div className={styles.createButton}>
                    <button onClick={handleEdit}>Save</button>
                    </div>
                </div>
            </div>
    )
}

export default EditAccountModal;