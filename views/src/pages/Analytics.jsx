import React, { useEffect, useState } from "react";
import styles from "../css/analytics.module.css";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAccounts } from "../utils/accountUtils";
import { fetchAnalytics, fetchAnalyticsLast6Months } from "../utils/analyticsUtils";
import PieChartForAnalytics from "../components/PieChartForAnalytics";
import BarChartForAnalytics from "../components/BarChartForAnalytics";

const CATEGORY_COLOR_MAP = {
  "Transportation": "#FF5733",
  "Food & Drinks": "#FFB900",
  "Vehicle Expenses": "#A83279",
  "Housing & Utilities": "#0074D9",
  "Personal & Wellness": "#FF69B4",
  "Shopping": "#0074D9",
  "Financial & Banking": "#6F42C1",
  "Entertainment & Recreation": "#FF851B",
  "Miscellaneous": "#999999"
};

const Analytics = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({});
  const [incomeExpenseDataBar, setIncomeExpenseDataBar] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [barData, setBarData] = useState({ categories: [], values: [] })

  useEffect(() => {
    const fetchAccounts = async () => {
      const accountsData = await getAccounts()
      const accounts = accountsData?.accounts || []
      const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
      setTotalBalance(total)
      console.log(total);
    }
    fetchAccounts()
  }, []);

  function formatMonth(monthString) {
    // Create a new date object using the first day of the given month
    const date = new Date(`${monthString}-01`);

    // Get the full month name (e.g., "April")
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  }

  const handleFetchAnalytics = async () => {
    setAnalyticsLoading(true)
    const data = await fetchAnalytics("month", "2025-04") // hardcoded
    console.log(data)

    const analytics = data?.analyticsData[0];
    setAnalyticsData(analytics);

    if (analytics?.categoryBreakdown?.length) {
      const breakdown = analytics.categoryBreakdown
        .filter(cat => cat.categoryName !== "Income & Earnings")
        .map(cat => ({
          label: cat.categoryName,
          value: cat.amount,
          color: CATEGORY_COLOR_MAP[cat.categoryName] || "#ccc",
        }));
      console.log(breakdown)
      setPieData(breakdown);

      const top5 = [...breakdown]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const barCategories = top5.map(item => item.label);
      const barValues = top5.map(item => item.value);

      setBarData({
        categories: barCategories,
        values: barValues,
      });
    }
    setAnalyticsLoading(false)

  }

  const handleFetchLast6Months = async () => {
    try {
      const data = await fetchAnalyticsLast6Months();
      console.log(data);
      // setAnalyticsData6Months(data);
      const formattedData = data?.map((item) => ({
        month: formatMonth(item.month).split(" ")[0], // "October 2024" → "October"
        income: item.totalIncome,
        expense: item.totalExpense,
      }));
      console.log(formattedData)
      setIncomeExpenseDataBar(formattedData);

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleFetchAnalytics()
    handleFetchLast6Months()
  }, [])

  // const expenseData = [
  //   { id: 0, value: 1250, label: "Food", color: "#00bcd4" },
  //   { id: 1, value: 900, label: "Travel", color: "#2196f3" },
  //   { id: 2, value: 600, label: "Shopping", color: "#e91e63" },
  //   { id: 3, value: 400, label: "Health", color: "#9c27b0" },
  //   { id: 4, value: 300, label: "Entertainment", color: "#3f51b5" },
  // ];
  // categories - array -> obj - categoryName, amount

  // top 5 categories -> filter by amount -> obj -> state []

  const categories = ["Food", "Rent", "Travel", "Shopping"];
  const values = [1250, 1200, 800, 400];

  // array of objects -> month, income , expense
  // const incomeExpenseData = [
  //   { month: "Nov", income: 5000, expense: 3200 },
  //   { month: "Dec", income: 6200, expense: 4000 },
  //   { month: "Jan", income: 7000, expense: 4500 },
  //   { month: "Feb", income: 6800, expense: 3900 },
  //   { month: "Mar", income: 7200, expense: 5000 },
  //   { month: "Apr", income: 7500, expense: 5300 },
  // ];
  return (
    <div className={styles.mainpage}>
      <div className={styles.middle}>
        <div className={styles.header}>
          <p style={{ fontSize: "24px" }}>Analytics</p>
          <div>
            <p>{formatMonth(analyticsData?.periodId)}</p>
            {/* <select className={styles.dateFilter}>
              <option>This Month</option>
              <option>This Week</option>
              <option>This Year</option>
            </select> */}
          </div>
        </div>
        <div className={styles.moneydataDiv}>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              <GiReceiveMoney className={styles.iconIncome} size={20} color="green" />
              Total Income
            </div>
            <div className={styles.money}>₹{analyticsData?.totalIncome || 0}</div>
          </div>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              {" "}
              <GiPayMoney className={styles.iconExpense} size={20} color="red" />
              Total Expense
            </div>
            <div className={styles.money}>₹{analyticsData?.totalExpense || 0}</div>
          </div>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              {" "}
              <GiTakeMyMoney className={styles.iconBalance} size={20} color="orange" />
              Current Balance
            </div>
            <div className={styles.money}>₹{totalBalance}</div>
          </div>
        </div>

        <div className={styles.graphsdiv}>
          <div className={styles.piecontainer}>
            <h2 className={styles.pietitle}>Expense Distribution</h2>
            {/* Pie Chart */}
            {/* <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}> */}

            {(!analyticsLoading && pieData.length > 0) &&
              <PieChartForAnalytics pieData={pieData} />}
            {/* </div> */}
          </div>


          <div className={styles.barchartdiv}>
            <h3 className={styles.bartitle}>Top Expenses Categories</h3>

            {(!analyticsLoading && barData.categories.length > 0) && <BarChartForAnalytics barData={barData} />}
          </div>
        </div>
        <div className={styles.incomeExpenseChart}>
          <h3 className={styles.chartHeading}>
            Income vs Expense (Last 6 Months)
          </h3>
          {incomeExpenseDataBar && (
            <BarChart
              className={styles.barr}
              width={500}
              height={250}
              xAxis={[
                {
                  scaleType: "band",
                  data: incomeExpenseDataBar.map((item) => item.month),
                },
              ]}
              series={[
                {
                  data: incomeExpenseDataBar.map((item) => item.income),
                  label: "Income",
                  color: "#4caf50",
                },
                {
                  data: incomeExpenseDataBar.map((item) => item.expense),
                  label: "Expense",
                  color: "#f44336",
                },
              ]}
              margin={{ top: 30, bottom: 40, left: 50, right: 20 }}
              grid={{ vertical: true }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Analytics;
