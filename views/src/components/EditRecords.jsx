import { useEffect, useRef, useState } from "react";
import styles from "../css/addrecords.module.css";
import Select from "react-select";
import AddAccountModal from "./AddAccountModal";
import { RxCross2 } from "react-icons/rx";
import { updateTransaction } from "../utils/transactionUtils";
import { getCategories } from "../utils/categoryUtils";
import { getAccounts } from "../utils/accountUtils";
import categoryIcons from "../constants/categoryIcons";

const EditRecords = ({ selectedRecord, setShowEditModal, fetchRecords }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState(null);
  const [categoryOption, setCategoryOption] = useState(null);
  const [subCategoryOption, setSubCategoryOption] = useState(null);
  const [account, setAccount] = useState(selectedRecord.account);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const accountSelectRef = useRef(null);
  const didFocusRef = useRef(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await getAccounts();
      setAccounts(res?.accounts || []);
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedRecord && accounts.length > 0) {
      const dateObj = new Date(selectedRecord.date);
      const date = dateObj.toISOString().split("T")[0];
      const time = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
        dateObj.getMinutes()
      ).padStart(2, "0")}`;

      setUpdatedRecord({
        ...selectedRecord,
        accountId:
          selectedRecord.accountId || selectedRecord.account?.accountId || "",
        date,
        time,
      });
    }
  }, [selectedRecord, accounts]);

  useEffect(() => {
    if (selectedRecord && categories.length > 0) {
      const matchedCat = selectedRecord?.category;
      if (matchedCat?.id) {
        const foundCategory = categories.find(
          (cat) => cat._id === matchedCat.id
        );
        if (foundCategory) {
          setCategoryOption({
            value: foundCategory._id,
            label: foundCategory.categoryName,
            icon: categoryIcons[foundCategory.categoryName],
          });

          const matchedSub = foundCategory.subCategories.find(
            (sub) => sub._id === matchedCat?.subCategory?.id
          );
          if (matchedSub) {
            setSubCategoryOption({
              value: matchedSub._id,
              label: matchedSub.subCategoryName,
              icon: categoryIcons[foundCategory.categoryName],
            });
          }
        }
      }
    }
  }, [selectedRecord, categories]);

  // Escape closes the modal.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowEditModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowEditModal]);

  // Move focus to the first field once, when the record has loaded.
  useEffect(() => {
    if (updatedRecord && !didFocusRef.current) {
      didFocusRef.current = true;
      accountSelectRef.current?.focus();
    }
  }, [updatedRecord]);

  const handleSubmit = async () => {
    if (!updatedRecord.amount || !categoryOption || !updatedRecord.accountId) {
      setFormError("Please fill all the required fields.");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const combinedDate = new Date(
        `${updatedRecord.date}T${updatedRecord.time}:00`
      );

      const finalData = {
        id: updatedRecord._id,
        type: { id: updatedRecord.type.id },
        amount: updatedRecord.amount,
        accountId: account.accountId,
        category: {
          id: categoryOption.value,
          subCategory: subCategoryOption?.value
            ? { id: subCategoryOption.value }
            : undefined,
        },
        payee: updatedRecord.payee,
        date: combinedDate.getTime(),
        note: updatedRecord.note,
        paymentType: updatedRecord.paymentType,
        status: updatedRecord.status,
      };

      await updateTransaction(finalData);
      await fetchRecords();
      setShowEditModal(false);
    } catch (err) {
      setFormError("Could not save the changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.categoryName,
    icon: categoryIcons[cat.categoryName],
  }));

  const subcategoryOptions =
    categories
      .find((cat) => cat._id === categoryOption?.value)
      ?.subCategories.map((sub) => ({
        value: sub._id,
        label: sub.subCategoryName,
        icon: categoryOption.icon,
      })) || [];

  const customSingleValue = ({ data }) => {
    return (
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "auto",
          left: "8px",
          gap: "10px",
          alignItems: "center",
          textWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: "18px",
          }}
        >
          {data?.icon}
        </div>
        <p
          style={{
            display: "flex",
            justifyContent: "left",
            width: "150px",
            overflow: "hidden",
            fontSize: "16px",
            textOverflow: "ellipsis",
          }}
        >
          {data.label}
        </p>
      </div>
    );
  };

  const customOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      <span
        style={{ fontSize: "18px", alignItems: "center", display: "flex" }}
      >
        {data?.icon}
      </span>
      <span
        style={{
          fontSize: "16px",
          textWrap: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {data.label}
      </span>
    </div>
  );

  if (!updatedRecord) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => setShowEditModal(false)}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-record-title"
      >
        <div className={styles.modalHeader}>
          <h3 id="edit-record-title" className={styles.modalTitle}>
            Edit record
          </h3>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className={styles.closeButton}
            aria-label="Close"
          >
            <RxCross2 />
          </button>
        </div>

        <div className={styles.modalBody}>
          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          <div
            className={styles.recordTypeToggle}
            role="group"
            aria-label="Record type"
          >
            <button
              type="button"
              className={updatedRecord.type.id === 1 ? styles.activeInc : ""}
              aria-pressed={updatedRecord.type.id === 1}
              onClick={() =>
                setUpdatedRecord({ ...updatedRecord, type: { id: 1 } })
              }
            >
              Income
            </button>
            <button
              type="button"
              className={updatedRecord.type.id === 2 ? styles.activeExp : ""}
              aria-pressed={updatedRecord.type.id === 2}
              onClick={() =>
                setUpdatedRecord({ ...updatedRecord, type: { id: 2 } })
              }
            >
              Expense
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="field">
              <label className="field__label" htmlFor="edit-account">
                Account
              </label>
              <select
                id="edit-account"
                ref={accountSelectRef}
                className="field__input"
                value={account.accountId}
                onChange={(e) => {
                  if (e.target.value === "add-new") {
                    setShowAddAccountModal(true);
                  } else {
                    const selected = accounts.find(
                      (a) => a._id === e.target.value
                    );
                    if (selected) {
                      setAccount({
                        accountId: selected._id,
                        accountName: selected.accountName,
                      });
                    }
                  }
                }}
              >
                <option key={account._id} value={account._id}>
                  {account.accountName}
                </option>
                {accounts.map((acc) => {
                  if (acc._id === account.accountId) {
                    return null;
                  }

                  return (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountName}
                    </option>
                  );
                })}
                <option value="add-new">+ Add Account</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="edit-amount">
                Amount
              </label>
              <input
                id="edit-amount"
                className="field__input"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={updatedRecord.amount}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    amount: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label className="field__label">Category</label>
              <Select
                options={categoryOptions}
                value={categoryOption}
                onChange={(cat) => {
                  setCategoryOption(cat);
                  setSubCategoryOption(null);
                }}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
                isSearchable={false}
                className={styles.reactSelect}
              />
            </div>

            <div className="field">
              <label className="field__label">Subcategory</label>
              <Select
                options={subcategoryOptions}
                value={subCategoryOption}
                onChange={setSubCategoryOption}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
                isSearchable={false}
                className={styles.reactSelect}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="edit-date">
                Date
              </label>
              <input
                id="edit-date"
                className="field__input"
                type="date"
                value={updatedRecord.date}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, date: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="edit-time">
                Time
              </label>
              <input
                id="edit-time"
                className="field__input"
                type="time"
                value={updatedRecord.time}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, time: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="edit-payment-type">
                Payment Type
              </label>
              <select
                id="edit-payment-type"
                className="field__input"
                value={updatedRecord.paymentType}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    paymentType: e.target.value,
                  })
                }
              >
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Credit Card</option>
                <option>Transfer</option>
                <option>Voucher</option>
                <option>UPI</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="edit-payment-status">
                Payment Status
              </label>
              <select
                id="edit-payment-status"
                className="field__input"
                value={updatedRecord.status}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    status: e.target.value,
                  })
                }
              >
                <option>Cleared</option>
                <option>Pending</option>
              </select>
            </div>

            <div className={`field ${styles.fieldFull}`}>
              <label className="field__label" htmlFor="edit-payee">
                Payee
              </label>
              <input
                id="edit-payee"
                className="field__input"
                type="text"
                value={updatedRecord.payee}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, payee: e.target.value })
                }
              />
            </div>

            <div className={`field ${styles.fieldFull}`}>
              <label className="field__label" htmlFor="edit-note">
                Note
              </label>
              <textarea
                id="edit-note"
                className="field__input"
                value={updatedRecord.note}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, note: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        {showAddAccountModal && (
          <AddAccountModal
            accounts={accounts}
            setAccounts={setAccounts}
            showAddAccountModal={showAddAccountModal}
            setShowAddAccountModal={setShowAddAccountModal}
          />
        )}
      </div>
    </div>
  );
};

export default EditRecords;
