import { useContext, useEffect, useState } from "react";
import styles from "../css/addrecords.module.css";
import categoriesData from "../utils/modalCategories";
import Select from "react-select";
import AppContext from "../context/AppContext";
import { getAccounts } from "../utils/accountUtils";
import AddAccountModal from "./AddAccountModal";
import { RxCross2 } from "react-icons/rx";
import { createTransaction, getAllTransactionsOfUser } from "../utils/transactionUtils";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

const AddRecords = () => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const { setRecords, setAddRecords } = useContext(AppContext);
  const [recordType, setRecordType] = useState(2);
  const [accLoading, setAccLoading] = useState(true);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  //   const [time, setTime]=useState(new Date().toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    setAccountId(accounts[0]?._id)
  }, [accounts])

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // ISO format (yyyy-mm-dd)
  const [displayDate, setDisplayDate] = useState(
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })
  ); // Display format "Month Day"

  const addNewRecord = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(e.target.value); // Keeps the date in ISO format (yyyy-mm-dd)
    // setDisplayDate(
    //   newDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    // ); // Formats to "March 25"
  };

  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  function getTimeStampFromDateandTime(dateStr,timeStr){
    const combined = `${dateStr}T${timeStr}:00`
    const date= new Date(combined)
    return (date.getTime())
  }
  const fetchRecords=async ()=>{
      const fetchedRecords=await getAllTransactionsOfUser()
      setRecords(fetchedRecords) 
      console.log(fetchedRecords);
     }


useEffect(() => {
  setDate(getTimeStampFromDateandTime(selectedDate,time))
  const newDate = new Date(`${selectedDate}T${time}`);
  setDisplayDate(
    newDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  );
}, [selectedDate, time]);


  const [payee, setPayee] = useState("");
  const [note, setNote] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Cleared");

  const handleSubmit = async () => {
    console.log(accountId);
    if (!amount || !category || !accountId) {
      alert("Please fill all the required fields!");
      return;
    }

    var newRecord = {
      type: {id: recordType},
      amount,
      accountId,
      category: {
        id: category?.value,
        subCategory: {
          id: subCategory?.value
        }
      },
      payee,
      date,
      note,
      paymentType,
      status: paymentStatus,
    };
    await createTransaction(newRecord)
    // addNewRecord(newRecord);
    setAddRecords(false);
    await fetchRecords()
    console.log(newRecord);
  };
  const categoryOptions = categoriesData.map((cat) => ({
    value: cat.id,
    label: cat.name, // Label should be a string
    icon: cat.icon,
  }));

  const handleCategoryChange = (selectedCategory) => {
    console.log(selectedCategory);
    setCategory(selectedCategory);
    setSubCategory(null);
  };

  //filter subcategory based on selected category...using find here bcause find compares with a single word also from category and displays subcategory accordingly
  const filteredSubcategories =
    categoriesData.find((cat) => cat.id === category?.value)?.subCategories ||
    [];

  const subcategoryOptions = filteredSubcategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
    icon: sub.icon,
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
        <div style={{
          fontSize: "18px",
        }}>
          {data.icon}
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
      <span style={{ fontSize: "18px", alignItems: "center", display: "flex" }}>{data.icon}</span>
      <span style={{ fontSize: "16px", textWrap: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{data.label}</span>
    </div>
  );

  const handleFetchAccounts = async () => {
    setAccLoading(true);
    const data = await getAccounts();
    setAccounts(data.accounts);
    setAccLoading(false);
  };
  useEffect(() => {
    if(accounts.length===0)
    handleFetchAccounts();
  }, []);


  // console.log(accountId);  

  return (
    <div className={styles.modalOverlay} onClick={() => setAddRecords(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>ADD RECORD</h3>
        <button
          onClick={() => setAddRecords(false)}
          className={styles.closeButton}
        >
          <RxCross2 />
        </button>

        <div className={styles.recordTypeToggle}>
          <button
            className={recordType === 1 ? styles.activeInc : ""}
            onClick={() => setRecordType(1)}
          >
            Income
          </button>
          <button
            className={recordType === 2 ? styles.activeExp : ""}
            onClick={() => setRecordType(2)}
          >
            Expense
          </button>
        </div>
        <div className={styles.upperhalf}>
          <div className={styles.accamt}>
            <div className={styles.inputGroup}>
              <label>Account</label>
              <select
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
                    <option
                      key={id}
                      value={account._id}
                    >
                      {account?.accountName}
                    </option>
                  );
                })}
                <option style={{ fontWeight: "600" }} value="add_account">+ Add Account
                </option>
              </select>
              {showAddAccountModal && (
                <AddAccountModal accounts={accounts} setAccounts={setAccounts}
                  showAddAccountModal={showAddAccountModal}
                  setShowAddAccountModal={setShowAddAccountModal}
                />
              )}
            </div>

            <div className={`${styles.inputGroup} ${styles.titleInput}`}>
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                >

                {/* {recordType === 1 ? (<IoMdAdd />) : recordType === 2 ? (<FaMinus />) : null} */}
                </input>
            </div>


          </div>

          <div className={styles.category}>
            <div className={styles.inputGroup}>
              <label>Category</label>
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

            <div className={styles.inputGroup}>
              <label>Subcategory</label>
              <Select
                options={subcategoryOptions}
                value={
                  subcategoryOptions.find(
                    (option) => option.value === subCategory?.value
                  ) || null
                }
                onChange={setSubCategory}
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
                placeholder="Choose Subcategory"
                isSearchable={false}
                className={styles.reactSelect}
              />
            </div>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin:"auto",
            // border:"1px solid red",
            width: "250px"
          }}>


          </div>
        </div>

        <div className={styles.lowerhalf}>
          <div className={styles.dateTimeWrapper}>
            <div className={styles.inputGroup}>
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              ></input>
            </div>
            <div className={styles.inputGroup}>
              <label>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              ></input>
            </div>
          </div>

          <div className={styles.payees}>
            <div className={styles.inputGroup}>
              <label>Payment Type</label>
              <select
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

            <div className={styles.inputGroup}>
              <label>Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
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
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                placeholder="Enter payee name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
              ></textarea>
            </div>
          </div>
        </div>

        <button className={styles.addButton} onClick={handleSubmit}>
          ADD RECORD
        </button>
      </div>
    </div>
  );
};
export default AddRecords;
