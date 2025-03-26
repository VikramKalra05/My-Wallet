import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Records from "../components/Records";
import styles from "../css/recordsPage.module.css"; // Import CSS for layout
import DateSorting from "../components/DateSorting";
import AppContext from "../context/AppContext";

const RecordsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const {records} =useContext(AppContext);
  const [sortedRecords , setSortedRecords]=useState(records) //for date sorting

  

  return (
    <div className={styles.container}>
      {/* <Navbar setAddRecords={setAddRecords} /> */}
      <div className={styles.sidebar}>
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className={styles.recordsContent}>
        <DateSorting setSortedRecords={setSortedRecords} />
        <Records selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default RecordsPage;
