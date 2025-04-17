import React, { useContext, useEffect, useState } from "react";
// import { records as initialRecords } from "../utils/dummydata";
import styles from "../css/records.module.css";
// import {deleteIcon} from "@chakra-ui/icons"
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import categoriesData from "../utils/modalCategories";
import { displayDate } from "../dateConversions/displayDate";
import { deleteTransaction } from "../utils/transactionUtils";
import EditRecords from "./EditRecords";
import ConfirmationModal from "./DeleteConfirmModal";
import { Skeleton } from "@mui/material";

const Records = ({
  selectedCategory,
  selectedAccounts,
  selectedPaymentTypes,
  selectedRecordTypes,
  selectedStatuses,
  fetchRecords,
  sortedRecords,
  loading,
  setLoading
}) => {
  // const { records, setRecords } = useContext(AppContNext);
  const [finalRecords, setFinalRecords] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); //for asking to delete any record
  const [zeroRecords, setZeroRecords] = useState(false);

  // useEffect(() => {
  //   if(finalRecords.length > 0){
  //     setLoading(false);
  //   }
  // }, [finalRecords])

  const handleDelete = async (id) => {
    // const updatedRecords = records.filter((record) => record.id !== id);
    // api call to delete the record
    // fetch records AGAIN
    await deleteTransaction(id);
    await fetchRecords();
    // setRecords(updatedRecords);
  };
  const handleConfirm = () => {
    if(currentRecordId){
      handleDelete(currentRecordId);
    }
    setShowConfirmModal(false);
  };
  const renderSkeletons = () => {
    return Array(8)
        .fill()
        .map((_, index) => (
            <div key={index} className={styles.accountSkeleton}>
                <Skeleton variant="rounded" height={"60px"} animation="wave"/>
            </div>
        ));
} ;

  const isCategorySelected = (record) => {
    if (
      (!selectedCategory || selectedCategory.length === 0) &&
      (!selectedAccounts || selectedAccounts.length === 0) &&
      (!selectedPaymentTypes || selectedPaymentTypes.length === 0) &&
      (!selectedRecordTypes || selectedRecordTypes.length === 0) &&
      (!selectedStatuses || selectedStatuses.length === 0)
    )
      return true;

    const mainCategory = record.category?.categoryName;
    const subCategory =
      record.subCategory?.subCategoryName ||
      record.category?.subCategory?.subCategoryName;
    const recordType = record.type?.typeName;
    const paymentType = record?.paymentType;
    const status = record?.status;
    const accountName = record?.account?.accountName;

    // console.log("bhal yo", selectedRecordTypes, recordType);

    return (
      selectedCategory.includes(mainCategory) ||
      selectedCategory.includes(subCategory) ||
      selectedAccounts.includes(accountName) ||
      selectedPaymentTypes.includes(paymentType) ||
      selectedRecordTypes.includes(recordType) ||
      selectedStatuses.includes(status)
    );
  };

  // const dateFilteredRecords = applyDateFilter(filteredRecords || []);

  const updateFinally = () => {
    const filteredRecords = sortedRecords?.filter(isCategorySelected) || [];
    if(sortedRecords.length === 0){
      setZeroRecords(true)
    }
    setFinalRecords(
      [...(filteredRecords || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
    setLoading(false)
  };

  useEffect(() => {
    updateFinally();
  }, [
    sortedRecords,
    selectedCategory,
    selectedAccounts,
    selectedPaymentTypes,
    selectedRecordTypes,
    selectedStatuses,
  ]);

  // const finalRecords = [...(filteredRecords || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  console.log("sortedRecords", sortedRecords);
  console.log("finalRecords", finalRecords);
  return (
    <div className={styles.container}>
      {/* <p>Showing records for: <strong>{selectedCategory || "All Categories"}</strong> </p> */}
      {loading && (
        <div className={styles.loadingContainer}>
          {renderSkeletons()}
        </div>
      )}
      {(!loading && finalRecords?.length === 0) && (
        <p>No Records Found</p>
      )}
      {(!loading && finalRecords?.length > 0) && (
        <div className={styles.recordsContainer}>
          {finalRecords?.map((record, id) => {
            const currentDate = displayDate(record?.date);
            const prevDate =
              id > 0 ? displayDate(finalRecords[id - 1].date) : null;
            const showDateHeader = currentDate !== prevDate;
            // console.log(record);
            return (
              <div key={record._id}>
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
                    <div className={styles.accountName}>
                      {record?.account?.accountName}
                    </div>
                  </div>
                  <div className={styles.middleSection}>
                    <div className={styles.paymentType}>
                      {record?.paymentType}
                    </div>
                    <div
                      className={styles.paymentStatus}
                      style={{
                        color: record?.status === "Pending" ? "red" : "green",
                      }}
                    >
                      {record?.status}
                    </div>
                    {/* <div className={styles.payee}>{record?.paymentType}</div> */}
                    <div className={styles.payee}>{record?.payee}</div>
                    {/* <div> {record.accountId}</div> */}
                    <div className={styles.note}>{record?.note}</div>
                  </div>
                  <div className={styles.rightSection}>
                    <div
                      className={styles.amount}
                      style={{
                        color: record?.type?.id === 2 ? "red" : "green",
                      }}
                    >
                      {record?.type?.id === 2 ? "-" : null}₹{record?.amount}
                    </div>

                    <button
                      className={styles.edit}
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowEditModal(true);
                      }}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        setCurrentRecordId(record?._id)
                        setShowConfirmModal(true)}}
                    >
                      <MdDelete size={20} />
                    </button>
                    {showConfirmModal && (
                      <ConfirmationModal
                        message="Are you sure you want to delete this record?"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirmModal(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showEditModal && (
        <EditRecords
          selectedRecord={selectedRecord}
          setShowEditModal={setShowEditModal}
          fetchRecords={fetchRecords}
        />
      )}
    </div>
  );
};
export default Records;
