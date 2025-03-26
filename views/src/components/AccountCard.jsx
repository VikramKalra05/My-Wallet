import React, { useState } from 'react'
import styles from "../css/accounts.module.css"
import { deleteAccount } from '../utils/accountUtils';
import { editAccount } from '../utils/accountUtils';
import EditAccountModal from './EditAccountModal';


const AccountCard = ({ account, fetchAccounts }) => {
    const [showEditAccountModal, setShowEditAccountModal] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteAccount({ id: account._id });
            fetchAccounts();
        } catch (error) {
            alert("Something went wrong while deleting account");
        }
    }   

    

    return (
        <div className={styles.accountCard}>
            <h1>{account?.accountName}</h1>
            <h1>{account?.balance}</h1>
            <button onClick={() => setShowEditAccountModal(true)}>Edit</button>
            <button onClick={handleDelete} >Delete</button>
            {showEditAccountModal && <EditAccountModal account={account} fetchAccounts={fetchAccounts} setShowEditAccountModal={setShowEditAccountModal} />}
        </div>
    )
}

export default AccountCard