import { useEffect, useRef, useState } from "react";
import styles from "../css/accounts.module.css";
import { createAccount } from "../utils/accountUtils";
import { RxCross2 } from "react-icons/rx";

const AddAccountModal = ({
  accounts,
  setAccounts,
  setShowAddAccountModal,
}) => {
  const [newAccountDetails, setNewAccountDetails] = useState({
    accountName: "",
    balance: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAddAccountModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowAddAccountModal]);

  const handleCreate = async () => {
    const accountName = newAccountDetails.accountName.trim();
    const { balance } = newAccountDetails;
    if (!accountName) {
      setFormError("Account name is required.");
      return;
    }
    if (balance === "" || Number.isNaN(Number(balance))) {
      setFormError("Enter a valid balance.");
      return;
    }
    setFormError("");
    setSaving(true);

    try {
      const newAccount = await createAccount(newAccountDetails);
      if (newAccount) {
        setAccounts([...accounts, newAccount]);
        setNewAccountDetails({
          accountName: "",
          balance: 0,
        });
        setShowAddAccountModal(false);
      }
    } catch (error) {
      setFormError("Something went wrong while creating the new account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setShowAddAccountModal(false)}
    >
      <div
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-account-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="add-account-title" className={styles.modalTitle}>
            Add Account
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            aria-label="Close"
            onClick={() => setShowAddAccountModal(false)}
          >
            <RxCross2 aria-hidden="true" />
          </button>
        </div>
        <div className={styles.modalForm}>
          {formError && (
            <p className={`form-error ${styles.modalError}`} role="alert">
              {formError}
            </p>
          )}
          <div className="field">
            <label className="field__label" htmlFor="add-account-name">
              Account Name
            </label>
            <input
              id="add-account-name"
              ref={nameInputRef}
              className="field__input"
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
          </div>
          <div className="field">
            <label className="field__label" htmlFor="add-account-balance">
              Balance
            </label>
            <input
              id="add-account-balance"
              className="field__input"
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
            />
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Adding…" : "Add Account"}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => setShowAddAccountModal(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
