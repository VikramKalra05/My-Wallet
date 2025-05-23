import React, { useContext, useState, useEffect } from "react";
import styles from "../css/dashboard.module.css";
import { AuthContext } from "../context/AuthContext";
import AddAccountModal from "../components/AddAccountModal";
import { getAccounts } from "../utils/accountUtils";
import { getAllTransactionsOfUser } from "../utils/transactionUtils";
import { displayDate } from "../dateConversions/displayDate";
import categoriesData from "../utils/modalCategories";
import PieChartForAnalytics from "../components/PieChartForAnalytics";
import { fetchAnalytics } from "../utils/analyticsUtils";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import { FaSpinner } from "react-icons/fa";
import {Link} from "react-router-dom"
import { FiExternalLink } from "react-icons/fi";

const CATEGORY_COLOR_MAP = {
  Transportation: "#FF5733",
  "Food & Drinks": "#FFB900",
  "Vehicle Expenses": "#A83279",
  "Housing & Utilities": "#0074D9",
  "Personal & Wellness": "#FF69B4",
  Shopping: "#0074D9",
  "Financial & Banking": "#6F42C1",
  "Entertainment & Recreation": "#FF851B",
  Miscellaneous: "#999999",
};

const Dashboard = () => {
  const { userDetails } = useContext(AuthContext);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const [records, setRecords] = useState([]); // State to hold fetched records
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({});

  const handleFetchAnalytics = async () => {
    setAnalyticsLoading(true);
    const data = await fetchAnalytics("month", "2025-04"); // hardcoded
    console.log(data);

    const analytics = data?.analyticsData[0];
    setAnalyticsData(analytics);

    if (analytics?.categoryBreakdown?.length) {
      const breakdown = analytics.categoryBreakdown
        .filter((cat) => cat.categoryName !== "Income & Earnings")
        .map((cat) => ({
          label: cat.categoryName,
          value: cat.amount,
          color: CATEGORY_COLOR_MAP[cat.categoryName] || "#ccc",
        }));
      console.log(breakdown);
      setPieData(breakdown);
      setAnalyticsLoading(false);
    }
  };
  useEffect(() => {
    handleFetchAnalytics();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const fetchedRecords = await getAllTransactionsOfUser();
      console.log("blah", fetchedRecords);
      const sortedRecords = fetchedRecords.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRecords(sortedRecords.slice(0, 5)); // Only the latest 5 records
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };
  const fetchAccounts = async () => {
    const res = await getAccounts();
    setAccounts(res?.accounts);
  };

  useEffect(() => {
    fetchAccounts();
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div>
        <FaSpinner />
      </div>
    );
  }

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.midDiv}>
        <div className={styles.welcomeMsg}>
          <span className={styles.greeting}>Welcome</span>
          <span className={styles.userName}>{userDetails?.name}😄</span>
        </div>
        {/* <div className={styles.dashboardSubheading}>
          Your money at a glance 💰
        </div> */}

        <div className={styles.all4divs}>
          <div className={styles.firsthalf}>
          {loading ? (
              <div>Loading...</div>
            ) : accounts.length === 0 ? (
              <>
              <div className={styles.accountsDiv}><div style={{fontWeight:"500",fontSize:"20px",alignItems:"center",display:"flex",justifyContent:"center"}}>No accounts found</div>
              <div className={styles.linkAccounts} style={{
                textAlign: "center",
                alignItems:"center"
              }}>
              <Link className={styles.linkacc} style={{justifyContent:"center",alignItems:"center",display:"flex",margin:"auto",gap:"5px"}} to="/accounts">Create new account <FiExternalLink/></Link></div>
              </div>
              </>
            ) : (
            <div className={styles.accountsDiv}>
              <div className={styles.accheading}>
              <div className={styles.heading}>Top 5 accounts</div>
              <div className={styles.linkAccounts}>
              <Link className={styles.linkacc} to="/accounts">Go to Accounts <FiExternalLink/></Link></div>
              </div>
              <div className={styles.mine}>
                {[...accounts]
                  .sort((a, b) => b.balance - a.balance)
                  .slice(0, 5)
                  .map((account, id) => (
                    <div className={styles.data} key={id}>
                      <div className={styles.name}>{account.accountName}</div>
                      <div className={styles.balance}>₹{account.balance}</div>
                    </div>
                  ))}
                  {accounts.length < 5 && (
                <div>
                  <button
                    className={styles.addButton}
                    onClick={() => setShowAddAccountModal(true)}
                  >
                    + Add Account
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
                )}
              
              </div>
         
            </div>
            )}
            {loading ? (
              <div>Loading...</div>
            ) : records.length === 0 ? (
              <div className={styles.recordsContainer}><div style={{fontWeight:"500",fontSize:"20px",alignItems:"center",display:"flex",justifyContent:"center"}}>No records found</div></div>
            ) : (
              <div className={styles.recordsContainer}>
                <div className={styles.headingWrapper}>
                <div style={{fontSize:"20px",fontWeight:"500",textDecoration:"underline"}}>Latest 5 Records</div> <div className={styles.divlinkrecord}> <Link className={styles.link} to="/records">Go to Records <FiExternalLink /></Link></div>
                </div>
                {records.map((record) => {
                  const currentDate = displayDate(record?.date);
                  // const prevDate =
                  //   id > 0 ? displayDate(records[id - 1].date) : null;
                  // const showDateHeader = currentDate !== prevDate;

                  return (
                    <div key={record._id}>
                      <div className={styles.recordsItem}>
                        <div className={styles.leftSection}>
                          <div className={styles.icon}>
                            {getCategoryIcon(record?.category?.categoryName)}
                          </div>

                          <div className={styles.category}>
                            {record?.category?.subCategory?.subCategoryName ||
                              record?.category?.categoryName}
                            <div className={styles.accountName}>
                              {" "}
                              •{record?.account?.accountName}
                            </div>
                          </div>
                        </div>

                        <div className={styles.rightSection}>
                          <div
                            className={styles.amount}
                            style={{
                              color: record?.type?.id === 2 ? "red" : "green",
                            }}
                          >
                            ₹{record?.amount}
                          </div>
                          {currentDate && (
                            <div className={styles.dateDiv}>
                              <div className={styles.date}>{currentDate}</div>
                            </div>
                          )}
                        </div>
                      
                      </div>
                    </div>
                  );
                })}
               
              </div>
            )}
          </div>
          <div className={styles.secondhalf}>
          {loading ? (
              <div>Loading...</div>
            ) : records.length === 0 ? (
              <div className={styles.bargraphDiv}><div style={{fontWeight:"500",fontSize:"20px",alignItems:"center",display:"flex",justifyContent:"center"}}>Create records to get an overview of income vs expense</div></div>
            ) : (
            <div className={styles.bargraphDiv}>Income vs Expense Overview  (This Month)
              {analyticsData && (
                <IncomeExpenseBarChart
                  data={{
                    income: analyticsData.totalIncome,
                    expense: analyticsData.totalExpense,
                  }}
                />
              )}
            </div>
              )}
               {loading ? (
              <div>Loading...</div>
            ) : records.length === 0 ? (
              <div className={styles.piechartDiv}><div style={{fontWeight:"500",fontSize:"20px",alignItems:"center",display:"flex",justifyContent:"center"}}>Create records to get expense distribution by categories</div></div>
            ) : (
            <div className={styles.piechartDiv}>Expense By Category (This Month)
              {!analyticsLoading && pieData.length > 0 && (
                <PieChartForAnalytics pieData={pieData} />
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
