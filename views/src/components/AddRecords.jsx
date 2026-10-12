import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/addrecords.module.css";
import Select from "react-select";
import AppContext from "../context/AppContext";
import { getAccounts } from "../utils/accountUtils";
import AddAccountModal from "./AddAccountModal";
import { RxCross2 } from "react-icons/rx";
import {
  createTransaction,
  getAllTransactionsOfUser,
} from "../utils/transactionUtils";
import { getCategories } from "../utils/categoryUtils";
import categoryIcons from "../constants/categoryIcons";

const AddRecords = () => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const { setRecords, setAddRecords } = useContext(AppContext);
  const [recordType, setRecordType] = useState(2);
  const [accLoading, setAccLoading] = useState(true);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState([]);

  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState([]); // Store all categories fetched
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const accountSelectRef = useRef(null);

  useEffect(() => {
    setAccountId(accounts[0]?._id);
  }, [accounts]);

  // Move focus into the modal on open; Escape closes it.
  useEffect(() => {
    accountSelectRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setAddRecords(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res) {
          setCategories(res);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const today = new Date();
  const initialDate = today.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // 'YYYY-MM-DD'

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Keeps the date in ISO format (yyyy-mm-dd)
  };

  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  function getTimeStampFromDateandTime(dateStr, timeStr) {
    const combined = `${dateStr}T${timeStr}:00`;
    const date = new Date(combined);
    return date.getTime();
  }

  const fetchRecords = async () => {
    const fetchedRecords = await getAllTransactionsOfUser();
    setRecords(fetchedRecords || []);
  };

  useEffect(() => {
    setDate(getTimeStampFromDateandTime(selectedDate, time));
  }, [selectedDate, time]);

  const [payee, setPayee] = useState("");
  const [note, setNote] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Cleared");

  const handleSubmit = async () => {
    if (!amount || !category || !accountId) {
      setFormError("Please fill all the required fields.");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const newRecord = {
        type: { id: recordType },
        amount,
        accountId,
        category: {
          id: category?.value,
          subCategory: {
            id: subCategory?.value,
          },
        },
        payee,
        date,
        note,
        paymentType,
        status: paymentStatus,
      };
      await createTransaction(newRecord);
      setAddRecords(false);
      await fetchRecords();
    } catch (err) {
      setFormError("Could not save the record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories?.map((cat) => ({
    value: cat._id,
    label: cat.categoryName, // Label should be a string
    icon: categoryIcons[cat.categoryName],
  }));
  const selectedCategory = categories.find((cat) => cat._id === category?.value);
  const categoryIcon = categoryIcons[selectedCategory?.categoryName];

  const filteredSubcategories =
    categories.find((cat) => cat._id === category?.value)?.subCategories || [];

  const handleCategoryChange = (selected) => {
    setCategory(selected);
    setSubCategory(null);
  };

  const handleSubCategoryChange = (selected) => {
    setSubCategory(selected);
  };

  //filter subcategory based on selected category...using find here bcause find compares with a single word also from category and displays subcategory accordingly

  const subcategoryOptions = filteredSubcategories.map((sub) => ({
    value: sub._id,
    label: sub.subCategoryName,
    icon: categoryIcon,
  }));

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

  const handleFetchAccounts = async () => {
    setAccLoading(true);
    const data = await getAccounts();
    setAccounts(data.accounts);
    setAccLoading(false);
  };

  useEffect(() => {
    if (accounts.length === 0) handleFetchAccounts();
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={() => setAddRecords(false)}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-record-title"
      >
        <div className={styles.modalHeader}>
          <h3 id="add-record-title" className={styles.modalTitle}>
            Add record
          </h3>
          <button
            type="button"
            onClick={() => setAddRecords(false)}
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
              className={recordType === 1 ? styles.activeInc : ""}
              aria-pressed={recordType === 1}
              onClick={() => setRecordType(1)}
            >
              Income
            </button>
            <button
              type="button"
              className={recordType === 2 ? styles.activeExp : ""}
              aria-pressed={recordType === 2}
              onClick={() => setRecordType(2)}
            >
              Expense
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="field">
              <label className="field__label" htmlFor="add-account">
                Account
              </label>
              <select
                id="add-account"
                ref={accountSelectRef}
                className="field__input"
                value={accountId}
                onChange={(e) => {
                  const selectedValue = e.target.value;

                  if (selectedValue === "add_account") {
                    setShowAddAccountModal(true); // Open modal
                  } else {
                    setAccountId(selectedValue); // Set selected account
                  }
                }}
              >
                {accLoading && <option>Loading</option>}
                {!accLoading && accounts?.length === 0 && (
                  <option value="1">Cash</option>
                )}
                {accounts?.map((account, id) => {
                  return (
                    <option key={id} value={account._id}>
                      {account?.accountName}
                    </option>
                  );
                })}
                <option value="add_account">+ Add Account</option>
              </select>
              {showAddAccountModal && (
                <AddAccountModal
                  accounts={accounts}
                  setAccounts={setAccounts}
                  showAddAccountModal={showAddAccountModal}
                  setShowAddAccountModal={setShowAddAccountModal}
                />
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="add-amount">
                Amount
              </label>
              <input
                id="add-amount"
                className="field__input"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="field">
              <label className="field__label">Category</label>
              <Select
                options={categoryOptions}
                value={category}
                onChange={handleCategoryChange}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
                placeholder="Choose Category"
                isSearchable={false}
                className={styles.reactSelect}
              />
            </div>

            <div className="field">
              <label className="field__label">Subcategory</label>
              <Select
                options={subcategoryOptions}
                value={subCategory}
                onChange={handleSubCategoryChange}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
                placeholder="Choose Subcategory"
                isSearchable={false}
                className={styles.reactSelect}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="add-date">
                Date
              </label>
              <input
                id="add-date"
                className="field__input"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="add-time">
                Time
              </label>
              <input
                id="add-time"
                className="field__input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="add-payment-type">
                Payment Type
              </label>
              <select
                id="add-payment-type"
                className="field__input"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
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
              <label className="field__label" htmlFor="add-payment-status">
                Payment Status
              </label>
              <select
                id="add-payment-status"
                className="field__input"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option>Cleared</option>
                <option>Pending</option>
              </select>
            </div>

            <div className={`field ${styles.fieldFull}`}>
              <label className="field__label" htmlFor="add-payee">
                Payee
              </label>
              <input
                id="add-payee"
                className="field__input"
                type="text"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder="Enter payee name"
              />
            </div>

            <div className={`field ${styles.fieldFull}`}>
              <label className="field__label" htmlFor="add-note">
                Note
              </label>
              <textarea
                id="add-note"
                className="field__input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
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
            {saving ? "Saving…" : "Add record"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddRecords;
