import { useState } from "react";
import styles from "../css/accounts.module.css";
import { deleteAccount } from "../utils/accountUtils";
import EditAccountModal from "./EditAccountModal";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import ConfirmationModal from "./DeleteConfirmModal";

const AccountCard = ({ account, fetchAccounts }) => {
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const accountName = account?.accountName;

  const handleDelete = async () => {
    try {
      setDeleteError(false);
      await deleteAccount({ id: account._id });
      fetchAccounts();
    } catch (error) {
      setDeleteError(true);
    }
  };
  const handleConfirm = () => {
    handleDelete();
    setShowConfirmModal(false);
  };
  return (
    <article className={styles.accountCard}>
      <div className={styles.cardTop}>
        <h3 className={styles.accName}>{accountName}</h3>
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.cardActionBtn}
            aria-label={`Edit ${accountName}`}
            onClick={() => setShowEditAccountModal(true)}
          >
            <MdEdit size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.cardActionBtn} ${styles.cardActionBtn__danger}`}
            aria-label={`Delete ${accountName}`}
            onClick={() => setShowConfirmModal(true)}
          >
            <MdDelete size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className={styles.accBalance}>₹{account?.balance}</p>
      {account?.accountType && (
        <p className={styles.accType}>{account.accountType}</p>
      )}
      {deleteError && (
        <p className="field__error" role="alert">
          Couldn't delete this account. Try again.
        </p>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this account?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showEditAccountModal && (
        <EditAccountModal
          account={account}
          fetchAccounts={fetchAccounts}
          setShowEditAccountModal={setShowEditAccountModal}
        />
      )}
    </article>
  );
};

export default AccountCard;
