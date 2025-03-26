import { useState } from "react";
import { editAccount } from "../utils/accountUtils";
import styles from "../css/accounts.module.css";

const EditAccountModal = ({account, fetchAccounts, setShowEditAccountModal}) => {
 const [updatedAccount,setUpdatedAccount]=useState(account)   

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
        <div className={styles.editAccountModal} onClick={()=>setShowEditAccountModal(false)}>
            <div className={styles.editAccountModalContent} onClick={(e) => e.stopPropagation()}>
                <h1>Edit Account</h1>
                <button onClick={() => setShowEditAccountModal(false)}>Close</button>
                <div>
                    <input type="text" placeholder="Account Name" value={updatedAccount?.accountName} onChange={(e) => setUpdatedAccount({ ...updatedAccount, accountName: e.target.value })} />
                    <input type="number" placeholder="Account Balance" value={updatedAccount?.balance} onChange={(e) => setUpdatedAccount({ ...updatedAccount, balance: e.target.value })} />
                    <button onClick={handleEdit}>Edit</button>
                </div>
            </div>
        </div>
    )
}

export default EditAccountModal;