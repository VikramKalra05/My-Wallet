import { useEffect, useState } from "react";
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
      console.log("selectedRecord:", selectedRecord);
      console.log("accounts:", accounts);
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

  const handleSubmit = async () => {
    if (!updatedRecord.amount || !categoryOption || !updatedRecord.accountId) {
      alert("Please fill all required fields.");
      return;
    }

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
    console.log("FINAL DATA TO PATCH:", finalData);

    await updateTransaction(finalData);
    await fetchRecords();
    setShowEditModal(false);
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
      <span style={{ fontSize: "18px", alignItems: "center", display: "flex" }}>
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
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>EDIT RECORD</h3>
        <button
          onClick={() => setShowEditModal(false)}
          className={styles.closeButton}
        >
          <RxCross2 />
        </button>

        <div className={styles.recordTypeToggle}>
          <button
            className={updatedRecord.type.id === 1 ? styles.activeInc : ""}
            onClick={() =>
              setUpdatedRecord({ ...updatedRecord, type: { id: 1 } })
            }
          >
            Income
          </button>
          <button
            className={updatedRecord.type.id === 2 ? styles.activeExp : ""}
            onClick={() =>
              setUpdatedRecord({ ...updatedRecord, type: { id: 2 } })
            }
          >
            Expense
          </button>
        </div>

        <div className={styles.upperhalf}>
          {/* Account and Amount */}
          <div className={styles.accamt}>
            <div className={styles.inputGroup}>
              <label>Account</label>
              <select
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
                    console.log(acc._id);
                    return;
                  }
                  
                  return (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountName}
                    </option>
                  );
                })}
                <option value="add-new" style={{ fontWeight: "bold" }}>
                  + Add Account
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Amount</label>
              <input
                type="number"
                value={updatedRecord.amount}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    amount: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Category and Subcategory */}
          <div className={styles.category}>
            <div className={styles.inputGroup}>
              <label>Category</label>
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
            <div className={styles.inputGroup}>
              <label>Subcategory</label>
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
          </div>
        </div>

        {/* Date, Time, Payee, Note, Payment Info */}
        <div className={styles.lowerhalf}>
          <div className={styles.dateTimeWrapper}>
            <div className={styles.inputGroup}>
              <label>Date</label>
              <input
                type="date"
                value={updatedRecord.date}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, date: e.target.value })
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Time</label>
              <input
                type="time"
                value={updatedRecord.time}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.payees}>
            <div className={styles.inputGroup}>
              <label>Payment Type</label>
              <select
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

            <div className={styles.inputGroup}>
              <label>Payment Status</label>
              <select
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
          </div>

          <div className={styles.note}>
            <div className={styles.inputGroup}>
              <label>Payee</label>
              <input
                type="text"
                value={updatedRecord.payee}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, payee: e.target.value })
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Note</label>
              <textarea
                value={updatedRecord.note}
                onChange={(e) =>
                  setUpdatedRecord({ ...updatedRecord, note: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <button className={styles.addButton} onClick={handleSubmit}>
          SAVE
        </button>

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
