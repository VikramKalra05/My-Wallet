import React, { useEffect, useState } from "react";
import styles from "../css/analytics.module.css";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAccounts } from "../utils/accountUtils";

const Analytics = () => {
  const [totalBalance , setTotalBalance]=useState(0)

  useEffect(()=>{
    const fetchAccounts=async()=>{
      const accountsData=await getAccounts()
      const accounts=accountsData?.accounts || []
      const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
      setTotalBalance(total)
      console.log(total);
    }
    fetchAccounts()
  },[])
  const expenseData = [
    { id: 0, value: 1250, label: "Food", color: "#00bcd4" },
    { id: 1, value: 900, label: "Travel", color: "#2196f3" },
    { id: 2, value: 600, label: "Shopping", color: "#e91e63" },
    { id: 3, value: 400, label: "Health", color: "#9c27b0" },
    { id: 4, value: 300, label: "Entertainment", color: "#3f51b5" },
  ];
  // categories - array -> obj - categoryName, amount

  // top 5 categories -> filter by amount -> obj -> state []

  const categories = ["Food", "Rent", "Travel", "Shopping"];
  const values = [1250, 1200, 800, 400];

  // array of objects -> month, income , expense
  const incomeExpenseData = [
    { month: "Nov", income: 5000, expense: 3200 },
    { month: "Dec", income: 6200, expense: 4000 },
    { month: "Jan", income: 7000, expense: 4500 },
    { month: "Feb", income: 6800, expense: 3900 },
    { month: "Mar", income: 7200, expense: 5000 },
    { month: "Apr", income: 7500, expense: 5300 },
  ];
  return (
    <div className={styles.mainpage}>
      <div className={styles.middle}>
        <div className={styles.header}>
          <p style={{ fontSize: "24px" }}>Analytics</p>
          <div>
            <select className={styles.dateFilter}>
              <option>This Month</option>
              <option>This Week</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
        <div className={styles.moneydataDiv}>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              <GiReceiveMoney className={styles.iconIncome}  size={20} color="green" />
              Total Income
            </div>
            <div className={styles.money}>₹8888</div>
          </div>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              {" "}
              <GiPayMoney className={styles.iconExpense} size={20} color="red" />
              Total Expense
            </div>
            <div className={styles.money}>₹8888</div>
          </div>
          <div className={styles.innerDiv}>
            <div className={styles.heading}>
              {" "}
              <GiTakeMyMoney className={styles.iconBalance}  size={20} color="orange" />
              Current Balance
            </div>
            <div className={styles.money}>₹{totalBalance}</div>
          </div>
        </div>

        <div className={styles.graphsdiv}>
          <div className={styles.piecontainer}>
            <h2 className={styles.pietitle}>Expense Distribution</h2>
              {/* Pie Chart */}
              <PieChart
              series={[
                {
                  data: expenseData,
                  innerRadius: 40,
                  outerRadius: 100,
                  paddingAngle: 0,
                  cornerRadius: 5,
                  highlightScope: { faded: "none", highlighted: "item" },
                  faded: { additionalRadius: 0 },
                },
              ]}
              height={250}
              legend={{
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 20,
                itemMarkWidth: 20,
                itemMarkHeight: 20,
                markGap: 6,
                itemGap: 10,
                labelStyle: {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
              sx={{
                margin: "auto",
                width: "100%",
                maxWidth: "500px",
              }}
            />
          </div>
  

          <div className={styles.barchartdiv}>
            <h3 className={styles.bartitle}>Top Expenses Categories</h3>

            <BarChart
              width={500}
              height={250}
              layout="horizontal"
              series={[
                { data: values, label: "Amount Spent", color: "#3f51b5" },
              ]}
              yAxis={[
                {
                  data: categories,
                  scaleType: "band",
                  tickLabelStyle: { width: 90, fontSize: 14 },
                },
              ]}
              grid={{ horizontal: true }}
              margin={{ top: 40, bottom: 30, left: 100, right: 30 }}
              sx={{
                ".MuiBarElement-root:nth-of-type(1)": { fill: "#26A69A" },
                ".MuiBarElement-root:nth-of-type(2)": { fill: "#42A5F5" },
                ".MuiBarElement-root:nth-of-type(3)": { fill: "#EF5350" },
                ".MuiBarElement-root:nth-of-type(4)": { fill: "#FFA726" },
              }}
            />
          </div>
        </div>
        <div className={styles.incomeExpenseChart}>
          <h3 className={styles.chartHeading}>
            Income vs Expense (Last 6 Months)
          </h3>
          <BarChart
            className={styles.barr}
            width={500}
            height={250}
            xAxis={[
              {
                scaleType: "band",
                data: incomeExpenseData.map((item) => item.month),
              },
            ]}
            series={[
              {
                data: incomeExpenseData.map((item) => item.income),
                label: "Income",
                color: "#4caf50",
              },
              {
                data: incomeExpenseData.map((item) => item.expense),
                label: "Expense",
                color: "#f44336",
              },
            ]}
            margin={{ top: 30, bottom: 40, left: 50, right: 20 }}
            grid={{ vertical: true }}
          />
        </div>
      </div>
    </div>
  );
};
export default Analytics;
