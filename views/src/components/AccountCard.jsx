import React, { useState } from "react";
import styles from "../css/accounts.module.css";
import { deleteAccount } from "../utils/accountUtils";
import EditAccountModal from "./EditAccountModal";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const AccountCard = ({ account, fetchAccounts }) => {
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAccount({ id: account._id });
      fetchAccounts();
    } catch (error) {
      alert("Something went wrong while deleting account");
    }
  };

  return (
    <div className={styles.accountCard}>
      <div className={styles.accountdata}>
        <div className={styles.edit}>
          <h1 className={styles.accName}>
            {/* <span style={{ fontWeight: "bolder" }}>Account name:</span> */}
            {account?.accountName}
          </h1>
          <button
            className={styles.editbutton}
            onClick={() => setShowEditAccountModal(true)}
          >
            <MdEdit size={18} />
          </button>
        </div>
        <div className={styles.delete}>
          <h1  className={styles.accBalance}>
            {/* <span style={{ fontWeight: "bolder" }}>Balance:</span>₹ */}
            ₹{account?.balance}
          </h1>
          <button className={styles.deletebutton} onClick={handleDelete}>
            <MdDelete size={18} />
          </button>
        </div>
        {showEditAccountModal && (
          <EditAccountModal
            account={account}
            fetchAccounts={fetchAccounts}
            setShowEditAccountModal={setShowEditAccountModal}
          />
        )}
      </div>
    </div>
  );
};

export default AccountCard;
