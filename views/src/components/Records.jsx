import React, { useContext, useState } from "react";
// import { records as initialRecords } from "../utils/dummydata";
import styles from "../css/records.module.css";
// import {deleteIcon} from "@chakra-ui/icons"
import { MdDelete } from "react-icons/md";
import categoriesData from "../utils/modalCategories";
import AppContext from "../context/AppContext";
import { displayDate } from "../dateConversions/displayDate";

const Records = ({ selectedCategory, fetchRecords }) => {
  const { records, setRecords } = useContext(AppContext);

  const handleDelete = async (id) => {
    // const updatedRecords = records.filter((record) => record.id !== id);
    // api call to delete the record
    // fetch records AGAIN
    await fetchRecords();
    // setRecords(updatedRecords);
  };
  const isCategorySelected = (category) =>
    Array.isArray(selectedCategory) && selectedCategory.includes(category);

  // Ensure filtering strictly matches selected categories
  const filteredRecords = records?.filter(
    (record) =>
      selectedCategory?.length === 0 || // Show all if nothing is selected
      isCategorySelected(record.category) ||
      isCategorySelected(record.subCategory?.label || record.subCategory)
  );

  // If no records match the selection, show "No Records Found" and sorting the records date wise from newest to oldest
  const finalRecords =
    filteredRecords?.length > 0
      ? [...filteredRecords].sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  console.log("lalalalal", records);
  return (
    <div className={styles.container}>
      {/* <p>Showing records for: <strong>{selectedCategory || "All Categories"}</strong> </p> */}
      {records?.length === 0 ? (
        <p>No Records Found</p>
      ) : (
        <div className={styles.recordsContainer}>
          {records?.map((record, id) => {
            const currentDate = displayDate(record?.date);
            const prevDate = id > 0 ? displayDate(records[id - 1].date) : null;
            const showDateHeader = currentDate != prevDate;
            // console.log(record);
            return (
              <div key={id}>
                {showDateHeader && (
                  <div className={styles.dateDiv}>
                    <div className={styles.date}>{currentDate}</div>
                  </div>
                )}
                <div className={styles.recordsItem}>
                  <div className={styles.leftSection}>
                    <div className={styles.icon}>
                      {getCategoryIcon(record?.category?.categoryName)}
                      {/* {record?.category?.categoryName} */}
                    </div>

                    {/* <div className={styles.time}>{record.time}</div> */}

                    {record?.category?.subCategory?.subCategoryName ? (
                      <div className={styles.category}>
                        {" "}
                        {record?.category?.subCategory?.subCategoryName}
                      </div>
                    ) : (
                      <div className={styles.category}>
                        {" "}
                        {record?.category?.categoryName}
                      </div>
                    )}
                  </div>
                  <div className={styles.middleSection}>
                    <div className={styles.paymentMethod}>
                      {record?.account?.accountName}
                    </div>
                    <div className={styles.paymentStatus}>
                      {record?.status}
                    </div>
                    <div className={styles.payee}>{record?.payee}</div>
                    {/* <div> {record.accountId}</div> */}
                    <div className={styles.note}>{record?.note}</div>
                  </div>
                  <div className={styles.rightSection}>
                    <div className={styles.amount}>₹{record?.amount}</div>
                    <button
                      className={styles.delete}
                      onClick={() => handleDelete(record?._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Records;
