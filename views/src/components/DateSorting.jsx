import { useContext, useEffect, useState } from "react";
import styles from "../css/datefilter.module.css";
import { FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";

const DateSorting = ({ setSortedRecords }) => {
  const {records} = useContext(AppContext);
  const [dateFilter, setDateFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const filterLabels = {
    all: "All Records",
    last7days: "Last 7 Days",
    lastMonth: "Last Month",
    lastYear: "Last Year",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
  };

  //helper functions to get the start dates for filtering
  const getStartOfWeek = () => {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    return start;
  };

  const getStartOfMonth = () => {
    const start = new Date();
    start.setDate(1);
    return start;
  };

  const getStartOfYear = () => {
    const start = new Date();
    start.setMonth(0, 1);
    return start;
  };

  const filterFunctions = {
    all: () => records,
    today: () => {
      const today = new Date();
      console.log(today)
      return records.filter(
        (record) =>
          new Date(record.displayDate).toDateString() === today.toDateString()
      );
    },
    thisWeek: () => {
      const startOfWeek = getStartOfWeek();
      startOfWeek.setHours(0, 0, 0, 0);
      console.log("Start of This Week:", startOfWeek);
      return records.filter(
        (record) => new Date(record.displayDate) >= startOfWeek
      );
    },
    thisMonth: () => {
      const startOfMonth = getStartOfMonth();
      startOfMonth.setHours(0, 0, 0, 0);
      console.log("Start of This Month:", startOfMonth);
      return records.filter(
        (record) => new Date(record.displayDate) >= startOfMonth
      );
    },
    thisYear: () => {
      const startOfYear = getStartOfYear();
      console.log(startOfYear)
      return records.filter(
        (record) =>
          new Date(record.displayDate).getFullYear() ===
          startOfYear.getFullYear()
      );
    },
    last7days: () => {
      const last7days = new Date();
      last7days.setDate(last7days.getDate() - 7);
      return records.filter(
        (record) => new Date(record.displayDate) >= last7days
      );
    },
    lastMonth: () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth()-1);
      return records.filter(
        (record) =>
          new Date(record.displayDate).getMonth() === lastMonth.getMonth()
      );
    },
    lastYear: () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      return records.filter(
        (record) =>
          new Date(record.displayDate).getFullYear() === lastYear.getFullYear()
      );
    },
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setSortedRecords(filterFunctions[filter]());
    setIsOpen(false);
  };
  //applying "all" filter by default whenever records change
  useEffect(() => {
    setSortedRecords(filterFunctions["all"]());
  }, [records]); //runs when records change

  return (
    <div>
      <div style={{ position: "absolute" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dropdownButton}
        >
          {filterLabels[dateFilter] || "All Records"}
          <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`}>
            <FaAngleDown color="green" />
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.firsthalf}>
              {["all", "last7days", "lastMonth", "lastYear"].map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleDateFilterChange(filter)}
                  className={`${styles.filterOption} ${
                    dateFilter === "filter" ? styles.activeFilter : ""
                  }`}
                >
                  {filterLabels[filter]}
                </div>
              ))}
            </div>

            <div className={styles.lasthalf}>
              {["today", "thisWeek", "thisMonth", "thisYear"].map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleDateFilterChange(filter)}
                  className={`${styles.filterOption} ${
                    dateFilter === filter ? styles.activeFilter : ""
                  }`}
                >
                  {filterLabels[filter]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSorting;
