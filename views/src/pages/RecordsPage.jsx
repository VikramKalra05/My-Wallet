import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Records from "../components/Records";
import styles from "../css/recordsPage.module.css"; // Import CSS for layout
import DateSorting from "../components/DateSorting";
import AppContext from "../context/AppContext";
import { getAllTransactionsOfUser } from "../utils/transactionUtils";

const RecordsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const { records, setRecords } = useContext(AppContext);
  const [sortedRecords, setSortedRecords] = useState(records); //for date sorting

  useEffect(() => {
    setSortedRecords(records);
  }, [records]);

  const fetchRecords = async () => {
    const fetchedRecords = await getAllTransactionsOfUser();
    setRecords(fetchedRecords);
    console.log(fetchedRecords);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className={styles.container}>
      {/* <Navbar setAddRecords={setAddRecords} /> */}
      <div className={styles.sidebar}>
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
      <div className={styles.recordsContent}>
        <DateSorting setSortedRecords={setSortedRecords} />
        <Records
          selectedCategory={selectedCategory}
          selectedAccounts={selectedAccounts}
          selectedPaymentTypes={selectedPaymentTypes}
          selectedRecordTypes={selectedRecordTypes}
          selectedStatuses={selectedStatuses}
          fetchRecords={fetchRecords}
          sortedRecords={sortedRecords}
        />
      </div>
    </div>
  );
};

export default RecordsPage;
