import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/datefilter.module.css";
import { FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";

const DateSorting = ({ sortedRecords, setSortedRecords }) => {
  const { records } = useContext(AppContext);
  const [dateFilter, setDateFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const dateSortingRef = useRef(null);

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

  // Helper functions to get the start dates for filtering
  const getStartOfWeek = () => {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0); // Normalize time
    return start;
  };

  const getStartOfMonth = () => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0); // Normalize time
    return start;
  };

  const getStartOfYear = () => {
    const start = new Date();
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0); // Normalize time
    return start;
  };

  const filterFunctions = {
    all: () => records,

    today: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time

      return records?.filter(
        (record) => new Date(record.date).toDateString() === today.toDateString()
      );
    },

    thisWeek: () => {
      const startOfWeek = getStartOfWeek();
      return records?.filter((record) => new Date(record.date) >= startOfWeek);
    },

    thisMonth: () => {
      const startOfMonth = getStartOfMonth();
      return records?.filter((record) => new Date(record.date) >= startOfMonth);
    },

    thisYear: () => {
      const startOfYear = getStartOfYear();
      return records?.filter(
        (record) =>
          new Date(record.date).getFullYear() === startOfYear.getFullYear()
      );
    },

    last7days: () => {
      const last7days = new Date();
      last7days.setDate(last7days.getDate() - 7);
      last7days.setHours(0, 0, 0, 0); // Normalize time

      return records?.filter((record) => new Date(record.date) >= last7days);
    },

    lastMonth: () => {
      // Ensure the range is the exact last month
      const startOfLastMonth = new Date();
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1, 1);
      startOfLastMonth.setHours(0, 0, 0, 0);

      const endOfLastMonth = new Date(startOfLastMonth);
      endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1, 0);
      endOfLastMonth.setHours(23, 59, 59, 999);

      return records?.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfLastMonth && recordDate <= endOfLastMonth;
      });
    },

    lastYear: () => {
      // Ensure the range is the exact last year
      const startOfLastYear = new Date();
      startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1, 0, 1);
      startOfLastYear.setHours(0, 0, 0, 0);

      const endOfLastYear = new Date(startOfLastYear);
      endOfLastYear.setFullYear(endOfLastYear.getFullYear(), 11, 31);
      endOfLastYear.setHours(23, 59, 59, 999);

      return records?.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfLastYear && recordDate <= endOfLastYear;
      });
    },
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setSortedRecords(filterFunctions[filter]());
    setIsOpen(false);
  };

  // Applying "all" filter by default whenever records change.
  // filterFunctions is rebuilt every render — listing it here would re-run
  // this on every render and loop through setSortedRecords.
  useEffect(() => {
    setSortedRecords(filterFunctions["all"]());
    setIsOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedRecords]);

  // Click-outside: ref wraps BOTH trigger and menu, so the trigger can close it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateSortingRef.current &&
        !dateSortingRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const renderOption = (filter) => (
    <div
      key={filter}
      role="option"
      aria-selected={dateFilter === filter}
      tabIndex={0}
      onClick={() => handleDateFilterChange(filter)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDateFilterChange(filter);
        }
      }}
      className={`${styles.filterOption} ${
        dateFilter === filter ? styles.activeFilter : ""
      }`}
    >
      {filterLabels[filter]}
    </div>
  );

  return (
    <div className={styles.wrapper} ref={dateSortingRef}>
      <button
        type="button"
        className={styles.dropdownButton}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {filterLabels[dateFilter] || "All Records"}
        <span
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
          aria-hidden="true"
        >
          <FaAngleDown />
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.dropdownMenu}
          role="listbox"
          aria-label="Filter records by date"
        >
          <div className={styles.firsthalf} role="group" aria-label="Overall ranges">
            {["all", "last7days", "lastMonth", "lastYear"].map(renderOption)}
          </div>

          <div className={styles.lasthalf} role="group" aria-label="Period ranges">
            {["today", "thisWeek", "thisMonth", "thisYear"].map(renderOption)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSorting;
