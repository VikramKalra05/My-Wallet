import React, { useEffect, useState } from "react";
import styles from "../css/records.module.css";
import { MdDelete, MdEdit } from "react-icons/md";
import categoriesData from "../utils/modalCategories";
import { displayDate } from "../dateConversions/displayDate";
import { deleteTransaction } from "../utils/transactionUtils";
import EditRecords from "./EditRecords";
import ConfirmationModal from "./DeleteConfirmModal";

const Records = ({
  selectedCategory,
  selectedAccounts,
  selectedPaymentTypes,
  selectedRecordTypes,
  selectedStatuses,
  fetchRecords,
  sortedRecords,
  loading,
  setLoading,
}) => {
  const [finalRecords, setFinalRecords] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); //for asking to delete any record

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    await fetchRecords();
  };

  const handleConfirm = () => {
    if (currentRecordId) {
      handleDelete(currentRecordId);
    }
    setShowConfirmModal(false);
  };

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

    return (
      selectedCategory.includes(mainCategory) ||
      selectedCategory.includes(subCategory) ||
      selectedAccounts.includes(accountName) ||
      selectedPaymentTypes.includes(paymentType) ||
      selectedRecordTypes.includes(recordType) ||
      selectedStatuses.includes(status)
    );
  };

  const updateFinally = () => {
    const filteredRecords = sortedRecords?.filter(isCategorySelected) || [];
    setFinalRecords(
      [...(filteredRecords || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
    setLoading(false);
  };

  // updateFinally is redefined every render; the filter inputs that drive it
  // are listed as deps below, so it re-runs exactly when it should.
  useEffect(() => {
    updateFinally();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortedRecords,
    selectedCategory,
    selectedAccounts,
    selectedPaymentTypes,
    selectedRecordTypes,
    selectedStatuses,
  ]);

  const getCategoryIcon = (categoryName) => {
    const category = categoriesData.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className="state-block" role="status">
          <div className="spinner" aria-hidden="true" />
          <p className="state-block__text">Loading records…</p>
        </div>
      )}
      {!loading && finalRecords?.length === 0 && (
        <div className="state-block">
          <p className="state-block__title">No records found</p>
          <p className="state-block__text">
            Filters may be hiding some results — try clearing or adjusting
            them.
          </p>
        </div>
      )}
      {!loading && finalRecords?.length > 0 && (
        <div className={styles.recordsContainer}>
          {finalRecords?.map((record, id) => {
            const currentDate = displayDate(record?.date);
            const prevDate =
              id > 0 ? displayDate(finalRecords[id - 1].date) : null;
            const showDateHeader = currentDate !== prevDate;
            const isExpense = record?.type?.id === 2;
            const isPending = record?.status === "Pending";
            const categoryName =
              record?.category?.subCategory?.subCategoryName ||
              record?.category?.categoryName;
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
                    </div>

                    <div className={styles.category} title={categoryName}>
                      {categoryName}
                    </div>
                    <div
                      className={styles.accountName}
                      title={record?.account?.accountName}
                    >
                      {record?.account?.accountName}
                    </div>
                  </div>
                  <div className={styles.middleSection}>
                    <div
                      className={styles.paymentType}
                      title={record?.paymentType}
                    >
                      {record?.paymentType}
                    </div>
                    <div
                      className={`${styles.paymentStatus} ${
                        isPending
                          ? styles["status--pending"]
                          : styles["status--cleared"]
                      }`}
                    >
                      {record?.status}
                    </div>
                    <div className={styles.payee} title={record?.payee}>
                      {record?.payee}
                    </div>
                    <div className={styles.note} title={record?.note}>
                      {record?.note}
                    </div>
                  </div>
                  <div className={styles.rightSection}>
                    <div
                      className={`${styles.amount} ${
                        isExpense
                          ? styles["amount--expense"]
                          : styles["amount--income"]
                      }`}
                    >
                      {isExpense ? "-" : null}₹{record?.amount}
                    </div>

                    <button
                      type="button"
                      aria-label="Edit record"
                      className={styles.edit}
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowEditModal(true);
                      }}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete record"
                      className={styles.delete}
                      onClick={() => {
                        setCurrentRecordId(record?._id);
                        setShowConfirmModal(true);
                      }}
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
      {showEditModal && (
        <EditRecords
          selectedRecord={selectedRecord}
          setShowEditModal={setShowEditModal}
          fetchRecords={fetchRecords}
        />
      )}
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this record?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};
export default Records;
