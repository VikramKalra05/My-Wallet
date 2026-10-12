import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Records from "../components/Records";
import styles from "../css/recordsPage.module.css";
import DateSorting from "../components/DateSorting";
import AppContext from "../context/AppContext";
import { getAllTransactionsOfUser } from "../utils/transactionUtils";

const RecordsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const { records, setRecords, setAddRecords } = useContext(AppContext);
  const [sortedRecords, setSortedRecords] = useState(records); //for date sorting
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSortedRecords(records);
  }, [records]);

  const fetchRecords = async () => {
    setLoading(true);
    const fetchedRecords = await getAllTransactionsOfUser();
    setRecords(fetchedRecords || []);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="page">
      <div className="app-container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Records</h1>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setAddRecords(true)}
          >
            + Record
          </button>
        </div>
        <div className={styles.layout}>
          <div className={styles.sidebarCol}>
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              fetchRecords={fetchRecords}
              selectedAccounts={selectedAccounts}
              setSelectedAccounts={setSelectedAccounts}
              selectedPaymentTypes={selectedPaymentTypes}
              setSelectedPaymentTypes={setSelectedPaymentTypes}
              selectedRecordTypes={selectedRecordTypes}
              setSelectedRecordTypes={setSelectedRecordTypes}
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
            />
          </div>
          <div className={styles.recordsCol}>
            <DateSorting setSortedRecords={setSortedRecords} />
            <Records
              selectedCategory={selectedCategory}
              selectedAccounts={selectedAccounts}
              selectedPaymentTypes={selectedPaymentTypes}
              selectedRecordTypes={selectedRecordTypes}
              selectedStatuses={selectedStatuses}
              fetchRecords={fetchRecords}
              sortedRecords={sortedRecords}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
