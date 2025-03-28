import React, { useContext, useState } from "react";
// import { records as initialRecords } from "../utils/dummydata";
import styles from "../css/records.module.css";
// import {deleteIcon} from "@chakra-ui/icons"
import { MdDelete } from "react-icons/md";
import categoriesData from "../utils/modalCategories";
import AppContext from "../context/AppContext";

const Records = ({ selectedCategory }) => {
  const {records, setRecords} = useContext(AppContext);
  
  const handleDelete = (index) => {
    const updatedRecords = records.filter((record) => record.id !== index);
    console.log(updatedRecords);
    setRecords(updatedRecords);
  };
  const isCategorySelected = (category) =>
    Array.isArray(selectedCategory) && selectedCategory.includes(category);

  // Ensure filtering strictly matches selected categories
  const filteredRecords = records.filter(
    (record) =>
      selectedCategory.length === 0 || // Show all if nothing is selected
      isCategorySelected(record.category) ||
      isCategorySelected(record.subCategory?.label || record.subCategory)
  );

  // If no records match the selection, show "No Records Found"
  const finalRecords = filteredRecords.length > 0 ? filteredRecords : [];

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  return (
    <div className={styles.container}>
      {/* <p>Showing records for: <strong>{selectedCategory || "All Categories"}</strong> </p> */}
      {finalRecords.length === 0 ? (
        <p>No Records Found</p>
      ) : (
        <div className={styles.recordsContainer}>
          {finalRecords.map((record, index) => (
            <div key={index} className={styles.recordsItem}>
              <div className={styles.leftSection}>
                <div className={styles.icon}>
                  {getCategoryIcon(record.category)}
                </div>

                <div className={styles.date}>{record.displayDate}</div>
                {/* <div className={styles.time}>{record.time}</div> */}

                <div className={styles.category}> {record.subCategory}</div>
                </div>

                <div className={styles.middleSection}>
                <div className={styles.paymentMethod}>{record.paymentType}</div>
                <div className={styles.paymentStatus}>
                  {record.paymentStatus}
                </div>
                <div className={styles.payee}>{record.payee}</div>
                <div className={styles.note}>{record.note}</div>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.amount}>₹{record.amount}</div>
                <button
                  className={styles.delete}
                  onClick={() => handleDelete(index)}
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Records;
