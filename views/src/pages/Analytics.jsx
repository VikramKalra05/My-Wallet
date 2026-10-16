import React, { useEffect, useState } from "react";
import styles from "../css/analytics.module.css";
import { GiReceiveMoney, GiPayMoney, GiTakeMyMoney } from "react-icons/gi";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAccounts } from "../utils/accountUtils";
import { fetchAnalytics, fetchAnalyticsLast6Months, getCurrentMonthPeriodId } from "../utils/analyticsUtils";
import PieChartForAnalytics from "../components/PieChartForAnalytics";
import BarChartForAnalytics from "../components/BarChartForAnalytics";

/*
 * Chart palette — pie slices and bar fills are SVG paints, so they can't read
 * CSS variables. Every hex the analytics charts use lives in this one const,
 * mirroring the index.css tokens where a token exists. Keep the category hues
 * pairwise distinct (Shopping used to collide with Housing & Utilities).
 */
const CHART_PALETTE = {
  categories: {
    "Transportation": "#ff5733",
    "Food & Drinks": "#ffb900",
    "Vehicle Expenses": "#a83279",
    "Housing & Utilities": "#0074d9",
    "Personal & Wellness": "#ff69b4",
    "Shopping": "#2ecc40",
    "Financial & Banking": "#6f42c1",
    "Entertainment & Recreation": "#ff851b",
    "Miscellaneous": "#999999",
  },
  fallback: "#9aa5a4", // unknown category
  income: "#15803d", // --income
  expense: "#dc2626", // --expense
};

const CATEGORY_COLOR_MAP = CHART_PALETTE.categories;

const Analytics = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [incomeExpenseDataBar, setIncomeExpenseDataBar] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [barData, setBarData] = useState({ categories: [], values: [], colors: [] });
  const [monthsLoading, setMonthsLoading] = useState(true);
  const [monthsError, setMonthsError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accountsData = await getAccounts();
      // getAccounts resolves null when the request fails — keep the balance
      // on "—" rather than showing a made-up ₹0.
      if (accountsData) {
        const accounts = accountsData.accounts || [];
        const total = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
        setTotalBalance(total);
        setAccountsLoaded(true);
      }
    };
    fetchAccounts();
  }, []);

  function formatMonth(monthString) {
    if (!monthString || !/^\d{4}-\d{2}$/.test(monthString)) return "";

    const [year, month] = monthString.split("-").map(Number);
    // Local date from the parts: parsing "2026-10-01" as an ISO string would
    // be UTC midnight and roll back a month west of UTC
    const date = new Date(year, month - 1, 1);

    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  }

  const handleFetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      // fetchAnalytics swallows its own errors and resolves undefined when
      // the request fails, so treat "no response" as a failure here.
      const data = await fetchAnalytics("month", getCurrentMonthPeriodId());
      if (!data) {
        throw new Error("No analytics response");
      }

      const analytics = data?.analyticsData?.[0];
      setAnalyticsData(analytics || null);

      if (analytics?.categoryBreakdown?.length) {
        const breakdown = analytics.categoryBreakdown
          .filter(cat => cat.categoryName !== "Income & Earnings")
          .map(cat => ({
            label: cat.categoryName,
            value: cat.amount,
            color: CATEGORY_COLOR_MAP[cat.categoryName] || CHART_PALETTE.fallback,
          }));
        setPieData(breakdown);

        const top5 = [...breakdown]
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setBarData({
          categories: top5.map(item => item.label),
          values: top5.map(item => item.value),
          colors: top5.map(item => item.color),
        });
      }
    } catch (error) {
      setAnalyticsError(
        "Couldn't load this month's analytics. Check your connection and try again."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleFetchLast6Months = async () => {
    setMonthsLoading(true);
    setMonthsError(null);
    try {
      const data = await fetchAnalyticsLast6Months();
      if (!data) {
        throw new Error("No monthly history response");
      }
      const formattedData = data?.map((item) => ({
        month: formatMonth(item.month).split(" ")[0], // "October 2024" → "October"
        income: item.totalIncome,
        expense: item.totalExpense,
      }));
      setIncomeExpenseDataBar(formattedData);
    } catch (error) {
      setMonthsError(
        "Couldn't load income vs expense for the last 6 months. Try again."
      );
    } finally {
      setMonthsLoading(false);
    }
  };

  // Fetch both datasets once on mount; both handlers read from state only via
  // their setters, and re-running them on every render would loop.
  useEffect(() => {
    handleFetchAnalytics();
    handleFetchLast6Months();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A record exists only when the period genuinely has data — until then the
  // summary shows "—" instead of a misleading ₹0.
  const hasAnalytics = Boolean(analyticsData);

  const loadingBlock = (text) => (
    <div className="state-block" role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="state-block__text">{text}</p>
    </div>
  );

  const messageBlock = (title, text) => (
    <div className="state-block">
      <p className="state-block__title">{title}</p>
      <p className="state-block__text">{text}</p>
    </div>
  );

  const analyticsChartBody = (emptyTitle, emptyText, hasData, chart) => {
    if (analyticsLoading) return loadingBlock("Loading this month's analytics…");
    if (analyticsError) {
      return messageBlock(
        "Analytics unavailable",
        "Select Retry above to reload this month's data."
      );
    }
    return hasData ? (
      <div className={styles.chartBox}>{chart}</div>
    ) : (
      messageBlock(emptyTitle, emptyText)
    );
  };

  return (
    <div className="page">
      <div className="app-container">
        <header className={styles.header}>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>
            {formatMonth(analyticsData?.periodId) || formatMonth(getCurrentMonthPeriodId())}
          </p>
        </header>

        {analyticsError && (
          <div
            className={`form-error ${styles.errorRow} ${styles.errorBanner}`}
            role="alert"
          >
            <span className={styles.errorText}>{analyticsError}</span>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleFetchAnalytics}
            >
              Retry
            </button>
          </div>
        )}

        <section className={styles.summaryRow} aria-label="This month's summary">
          <div className={`card ${styles.summaryCard}`}>
            <div className={styles.summaryLabel}>
              <span
                className={`${styles.summaryChip} ${styles.chipIncome}`}
                aria-hidden="true"
              >
                <GiReceiveMoney size={18} />
              </span>
              Total income
            </div>
            <div className={`${styles.summaryValue} ${styles.valueIncome}`}>
              {hasAnalytics ? `₹${analyticsData.totalIncome ?? 0}` : "—"}
            </div>
          </div>

          <div className={`card ${styles.summaryCard}`}>
            <div className={styles.summaryLabel}>
              <span
                className={`${styles.summaryChip} ${styles.chipExpense}`}
                aria-hidden="true"
              >
                <GiPayMoney size={18} />
              </span>
              Total expense
            </div>
            <div className={`${styles.summaryValue} ${styles.valueExpense}`}>
              {hasAnalytics ? `₹${analyticsData.totalExpense ?? 0}` : "—"}
            </div>
          </div>

          <div className={`card ${styles.summaryCard}`}>
            <div className={styles.summaryLabel}>
              <span
                className={`${styles.summaryChip} ${styles.chipBalance}`}
                aria-hidden="true"
              >
                <GiTakeMyMoney size={18} />
              </span>
              Current balance
            </div>
            <div className={`${styles.summaryValue} ${styles.valueBalance}`}>
              {accountsLoaded ? `₹${totalBalance}` : "—"}
            </div>
          </div>
        </section>

        <div className={styles.chartGrid}>
          <section className={`card ${styles.panel}`}>
            <div className={styles.panelHead}>
              <div>
                <h2 className="section-title">Expense by category</h2>
                <p className={styles.panelSub}>This month</p>
              </div>
            </div>
            {analyticsChartBody(
              "No expenses this month",
              "Categories you spend on will show up here.",
              pieData.length > 0,
              <PieChartForAnalytics pieData={pieData} />
            )}
          </section>

          <section className={`card ${styles.panel}`}>
            <div className={styles.panelHead}>
              <div>
                <h2 className="section-title">Top expense categories</h2>
                <p className={styles.panelSub}>This month</p>
              </div>
            </div>
            {analyticsChartBody(
              "No expenses this month",
              "Your biggest spending categories will show up here.",
              barData.categories.length > 0,
              <BarChartForAnalytics barData={barData} />
            )}
          </section>
        </div>

        <section className={`card ${styles.panel} ${styles.panelWide}`}>
          <div className={styles.panelHead}>
            <div>
              <h2 className="section-title">Income vs expense</h2>
              <p className={styles.panelSub}>Last 6 months</p>
            </div>
          </div>

          {monthsLoading ? (
            loadingBlock("Loading income vs expense history…")
          ) : monthsError ? (
            <div className={`form-error ${styles.errorRow}`} role="alert">
              <span className={styles.errorText}>{monthsError}</span>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={handleFetchLast6Months}
              >
                Retry
              </button>
            </div>
          ) : incomeExpenseDataBar.length > 0 ? (
            <div className={styles.chartBox}>
              {/* No width prop: the chart tracks the panel width itself. */}
              <BarChart
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
                    color: CHART_PALETTE.income,
                  },
                  {
                    data: incomeExpenseDataBar.map((item) => item.expense),
                    label: "Expense",
                    color: CHART_PALETTE.expense,
                  },
                ]}
                margin={{ top: 30, bottom: 40, left: 50, right: 20 }}
                grid={{ vertical: true }}
              />
            </div>
          ) : (
            messageBlock(
              "No income or expense history yet",
              "Totals for the last 6 months will show up here."
            )
          )}
        </section>
      </div>
    </div>
  );
};
export default Analytics;
