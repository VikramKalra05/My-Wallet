import React, { useContext, useState, useEffect } from "react";
import styles from "../css/dashboard.module.css";
import { AuthContext } from "../context/AuthContext";
import AddAccountModal from "../components/AddAccountModal";
import { getAccounts } from "../utils/accountUtils";
import { getAllTransactionsOfUser } from "../utils/transactionUtils";
import { displayDate } from "../dateConversions/displayDate";
import categoriesData from "../utils/modalCategories";
import PieChartForAnalytics from "../components/PieChartForAnalytics";
import { fetchAnalytics, getCurrentMonthPeriodId } from "../utils/analyticsUtils";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

/*
 * Chart palette — pie slices are SVG fills, so hexes are the one place colour
 * is hardcoded here (mirrors index.css tokens where a token exists).
 * Keep every hue pairwise distinguishable — no repeats.
 */
const PALETTE = {
  transportation: "#ff5733",
  foodDrinks: "#ffb900",
  vehicle: "#a83279",
  housing: "#0074d9",
  personal: "#ff69b4",
  shopping: "#2ecc40", // was #0074d9 — collided with Housing & Utilities
  finance: "#6f42c1",
  entertainment: "#ff851b",
  misc: "#999999",
  fallback: "#9aa5a4",
};

const CATEGORY_COLOR_MAP = {
  Transportation: PALETTE.transportation,
  "Food & Drinks": PALETTE.foodDrinks,
  "Vehicle Expenses": PALETTE.vehicle,
  "Housing & Utilities": PALETTE.housing,
  "Personal & Wellness": PALETTE.personal,
  Shopping: PALETTE.shopping,
  "Financial & Banking": PALETTE.finance,
  "Entertainment & Recreation": PALETTE.entertainment,
  Miscellaneous: PALETTE.misc,
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
    const data = await fetchAnalytics("month", getCurrentMonthPeriodId());

    const analytics = data?.analyticsData?.[0];
    setAnalyticsData(analytics || { totalIncome: 0, totalExpense: 0 });

    if (analytics?.categoryBreakdown?.length) {
      const breakdown = analytics.categoryBreakdown
        .filter((cat) => cat.categoryName !== "Income & Earnings")
        .map((cat) => ({
          label: cat.categoryName,
          value: cat.amount,
          color: CATEGORY_COLOR_MAP[cat.categoryName] || PALETTE.fallback,
        }));
      setPieData(breakdown);
    }
    setAnalyticsLoading(false);
  };
  useEffect(() => {
    handleFetchAnalytics();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const fetchedRecords = await getAllTransactionsOfUser();
      const sortedRecords = [...(fetchedRecords || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRecords(sortedRecords.slice(0, 5)); // Only the latest 5 records
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
      setLoading(false);
    }
  };
  const fetchAccounts = async () => {
    const res = await getAccounts();
    setAccounts(res?.accounts || []);
  };

  useEffect(() => {
    fetchAccounts();
    fetchRecords();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  const barEmptyState = (
    <div className="state-block">
      <p className="state-block__text">Add a record to see income vs expense</p>
    </div>
  );

  const pieEmptyState = (
    <div className="state-block">
      <p className="state-block__text">
        Add a record to see spending by category
      </p>
    </div>
  );

  return (
    <div className="page">
      <div className="app-container">
        <header className={styles.header}>
          <p className={styles.greeting}>Welcome back</p>
          <h1 className={styles.userName}>{userDetails?.name}</h1>
        </header>

        {loading ? (
          <div className={`card ${styles.panel}`}>
            <div className="state-block" role="status">
              <div className="spinner" aria-hidden="true" />
              <p className="state-block__text">Loading your dashboard…</p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.gridPrimary}>
              <div className={`card ${styles.panel}`}>
                {accounts.length === 0 ? (
                  <div className="state-block">
                    <p className="state-block__title">No accounts yet</p>
                    <p className="state-block__text">
                      Create an account to start tracking your money.
                    </p>
                    <Link className="btn btn--primary" to="/accounts">
                      Create an account
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.panelHead}>
                      <h2 className="section-title">Top 5 accounts</h2>
                      <Link
                        className={`btn btn--ghost btn--sm ${styles.headLink}`}
                        to="/accounts"
                      >
                        Go to accounts{" "}
                        <FiExternalLink aria-hidden="true" />
                      </Link>
                    </div>
                    <div className={styles.accountList}>
                      {[...accounts]
                        .sort((a, b) => b.balance - a.balance)
                        .slice(0, 5)
                        .map((account) => (
                          <div
                            className={styles.accountRow}
                            key={account._id}
                          >
                            <span className={styles.accountName}>
                              {account.accountName}
                            </span>
                            <span className={styles.accountBalance}>
                              ₹{account.balance}
                            </span>
                          </div>
                        ))}
                      {accounts.length < 5 && (
                        <>
                          <button
                            type="button"
                            className={`btn btn--secondary btn--sm ${styles.addButton}`}
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
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className={`card ${styles.panel}`}>
                {records.length === 0 ? (
                  <div className="state-block">
                    <p className="state-block__title">No records yet</p>
                    <p className="state-block__text">
                      Add your first record to see it here.
                    </p>
                    <Link className="btn btn--primary" to="/records">
                      Add a record
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.panelHead}>
                      <h2 className="section-title">Latest records</h2>
                      <Link
                        className={`btn btn--ghost btn--sm ${styles.headLink}`}
                        to="/records"
                      >
                        Go to records{" "}
                        <FiExternalLink aria-hidden="true" />
                      </Link>
                    </div>
                    <div className={styles.recordList}>
                      {records.map((record) => {
                        const currentDate = displayDate(record?.date);

                        return (
                          <div className={styles.recordRow} key={record._id}>
                            <span
                              className={styles.recordIcon}
                              aria-hidden="true"
                            >
                              {getCategoryIcon(record?.category?.categoryName)}
                            </span>
                            <div className={styles.recordMeta}>
                              <span className={styles.recordCategory}>
                                {record?.category?.subCategory
                                  ?.subCategoryName ||
                                  record?.category?.categoryName}
                              </span>
                              {record?.account?.accountName && (
                                <span className={styles.recordAccount}>
                                  {record.account.accountName}
                                </span>
                              )}
                            </div>
                            <div className={styles.recordRight}>
                              <span
                                className={
                                  record?.type?.id === 2
                                    ? styles.amountOut
                                    : styles.amountIn
                                }
                              >
                                ₹{record?.amount}
                              </span>
                              {currentDate && (
                                <span className={styles.recordDate}>
                                  {currentDate}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.gridCharts}>
              <div className={`card ${styles.panel}`}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className="section-title">Income vs expense</h2>
                    <p className={styles.panelSub}>This month</p>
                  </div>
                </div>
                {records.length === 0 ? (
                  barEmptyState
                ) : (
                  analyticsData && (
                    <IncomeExpenseBarChart
                      data={{
                        income: analyticsData.totalIncome,
                        expense: analyticsData.totalExpense,
                      }}
                    />
                  )
                )}
              </div>

              <div className={`card ${styles.panel}`}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className="section-title">Expense by category</h2>
                    <p className={styles.panelSub}>This month</p>
                  </div>
                </div>
                {records.length === 0 ? (
                  pieEmptyState
                ) : (
                  !analyticsLoading &&
                  (pieData.length > 0 ? (
                    <PieChartForAnalytics pieData={pieData} />
                  ) : (
                    pieEmptyState
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
