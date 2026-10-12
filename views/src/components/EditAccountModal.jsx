import { useEffect, useRef, useState } from "react";
import { editAccount } from "../utils/accountUtils";
import styles from "../css/accounts.module.css";
import { RxCross2 } from "react-icons/rx";

const EditAccountModal = ({
  account,
  fetchAccounts,
  setShowEditAccountModal,
}) => {
  const [updatedAccount, setUpdatedAccount] = useState(account);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEditAccountModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowEditAccountModal]);

  const handleEdit = async () => {
    const accountName = updatedAccount?.accountName?.trim() ?? "";
    const { balance } = updatedAccount ?? {};
    if (!accountName) {
      setFormError("Account name is required.");
      return;
    }
    if (balance === "" || balance == null || Number.isNaN(Number(balance))) {
      setFormError("Enter a valid balance.");
      return;
    }
    setFormError("");
    setSaving(true);

    try {
      await editAccount({
        id: account._id,
        accountName: updatedAccount.accountName,
        balance: updatedAccount.balance,
      });
      fetchAccounts();
      setShowEditAccountModal(false);
    } catch (error) {
      setFormError("Something went wrong while editing the account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setShowEditAccountModal(false)}
    >
      <div
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-account-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="edit-account-title" className={styles.modalTitle}>
            Edit Account
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            aria-label="Close"
            onClick={() => setShowEditAccountModal(false)}
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
            <label className="field__label" htmlFor="edit-account-name">
              Account Name
            </label>
            <input
              id="edit-account-name"
              ref={nameInputRef}
              className="field__input"
              type="text"
              placeholder="Enter Account Name"
              value={updatedAccount?.accountName ?? ""}
              onChange={(e) =>
                setUpdatedAccount({
                  ...updatedAccount,
                  accountName: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="edit-account-balance">
              Balance
            </label>
            <input
              id="edit-account-balance"
              className="field__input"
              type="number"
              placeholder="Enter Balance"
              value={updatedAccount?.balance ?? ""}
              onChange={(e) =>
                setUpdatedAccount({
                  ...updatedAccount,
                  balance: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // prevent accidental form submission
                  handleEdit();
                }
              }}
            />
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={() => setShowEditAccountModal(false)}
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

export default EditAccountModal;
