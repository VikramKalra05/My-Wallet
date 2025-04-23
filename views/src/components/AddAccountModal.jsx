import { useState } from "react";
import styles from "../css/accounts.module.css";
import { createAccount } from "../utils/accountUtils";
import { RxCross2 } from "react-icons/rx";

const AddAccountModal = ({
  accounts,
  setAccounts,
  showAddAccountModal,
  setShowAddAccountModal,
}) => {
  const [newAccountDetails, setNewAccountDetails] = useState({
    accountName: "",
    balance: "",
  });
  // implement add account
  // create a form to add account - account name and balance
  // And use this Modal in Accounts page
  // open this modal on click of add account button in Accounts page
  // take help of Accounts page for create functionality
  const handleCreate = async () => {
    if (!newAccountDetails) {
      return;
    }

    try {
      const newAccount = await createAccount(newAccountDetails);
      console.log(newAccount);
      if (newAccount) {
        setAccounts([...accounts, newAccount]);
        setNewAccountDetails({
          accountName: "",
          balance: 0,
        });
        setShowAddAccountModal(false);
      }
    } catch (error) {
      alert("Something went wrong while creating new account");
    }
  };

  return (
    <div
      className={styles.AddAccountModalOverlay}
      onClick={() => setShowAddAccountModal(false)}
    >
      <div
        className={styles.AddAccountModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.top}>
          <h2 style={{ fontSize: "18px" }}>Add Account</h2>
          <button
            className={styles.closeButton}
            onClick={() => setShowAddAccountModal(false)}
          >
            <RxCross2 />
          </button>
        </div>
        <div className={styles.inputGroup}>
          <label>Account Name</label>
          <input
            type="text"
            placeholder="Enter Account Name"
            value={newAccountDetails.accountName}
            onChange={(e) =>
              setNewAccountDetails({
                ...newAccountDetails,
                accountName: e.target.value,
              })
            }
          />
          <label>Balance</label>
          <input
            type="number"
            placeholder="Enter Balance"
            value={newAccountDetails.balance}
            onChange={(e) =>
              setNewAccountDetails({
                ...newAccountDetails,
                balance: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevent accidental form submission
                handleCreate();
              }
            }}
          />{" "}
        </div>
        <div className={styles.createButton}>
          <button onClick={handleCreate}>ADD</button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
