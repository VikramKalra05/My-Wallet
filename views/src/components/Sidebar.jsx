import React, { useContext, useEffect, useState } from "react";
import styles from "../css/sidebar.module.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { getCategories } from "../utils/categoryUtils";
import { getAccounts } from "../utils/accountUtils";
import AppContext from "../context/AppContext";
import FILTERS from "../utils/categories";

const Sidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedAccounts,
  setSelectedAccounts,
  selectedPaymentTypes,
  setSelectedPaymentTypes,
  selectedRecordTypes,
  setSelectedRecordTypes,
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const { setAddRecords } = useContext(AppContext);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [expandedAccounts, setExpandedAccounts] = useState(false);

  const [expandedCategoriesSection, setExpandedCategoriesSection] =
    useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res) {
        setCategories(res);
      }
    };

    const fetchAccounts = async () => {
      const res = await getAccounts();
      if (res) {
        setAccounts(res.accounts);
      }
    };

    fetchCategories();
    fetchAccounts();
  }, []);

  // ✅ Toggle category expansion
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // ✅ Toggle subcategory expansion
  const toggleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
  };

  // ✅ Handle category selection
  const handleCategorySelection = (categoryName) => {
    setSelectedCategory((prev) =>
      prev.includes(categoryName)
        ? prev.filter((item) => item !== categoryName)
        : [...prev, categoryName]
    );
  };

  // ✅ Handle subcategory selection
  const handleSubCategorySelection = (subCategoryName) => {
    setSelectedCategory((prev) =>
      prev.includes(subCategoryName)
        ? prev.filter((item) => item !== subCategoryName)
        : [...prev, subCategoryName]
    );
  };

  // ✅ Handle account selection
  const handleAccountSelection = (accountName) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountName)
        ? prev.filter((item) => item !== accountName)
        : [...prev, accountName]
    );
  };
  const handleRecordTypeSelection = (type) => {
    setSelectedRecordTypes((prev) => {
      if (type === "All Record Types") {
        return prev.includes(type)
          ? []
          : FILTERS.find(
              (f) => f.categoryName === "Record Type"
            ).subCategories.map((sub) => sub.name);
      }

      const updatedSelection = prev.includes(type)
        ? prev.filter((t) => t !== type) // Remove selection
        : [...prev, type]; // Add selection

      // If all subcategories are selected, auto-select "All"
      const allSubcategories = FILTERS.find(
        (f) => f.categoryName === "Record Type"
      ).subCategories.map((sub) => sub.name);
      return allSubcategories.every((sub) => updatedSelection.includes(sub))
        ? ["All Record Types", ...updatedSelection]
        : updatedSelection;
    });
  };

  const handlePaymentTypeSelection = (paymentType) => {
    setSelectedPaymentTypes((prev) => {
      if (paymentType === "All Payment Types") {
        return prev.includes(paymentType)
          ? []
          : FILTERS.find(
              (f) => f.categoryName === "Payment Type"
            ).subCategories.map((sub) => sub.name);
      }

      const updatedSelection = prev.includes(paymentType)
        ? prev.filter((p) => p !== paymentType)
        : [...prev, paymentType];

      const allSubcategories = FILTERS.find(
        (f) => f.categoryName === "Payment Type"
      ).subCategories.map((sub) => sub.name);
      return allSubcategories.every((sub) => updatedSelection.includes(sub))
        ? ["All Payment Types", ...updatedSelection]
        : updatedSelection;
    });
  };

  const handleStatusSelection = (status) => {
    setSelectedStatuses((prev) => {
      if (status === "All Statuses") {
        return prev.includes(status)
          ? []
          : FILTERS.find((f) => f.categoryName === "Status").subCategories.map(
              (sub) => sub.name
            );
      }

      const updatedSelection = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];

      const allSubcategories = FILTERS.find(
        (f) => f.categoryName === "Status"
      ).subCategories.map((sub) => sub.name);
      return allSubcategories.every((sub) => updatedSelection.includes(sub))
        ? ["All Statuses", ...updatedSelection]
        : updatedSelection;
    });
  };

  console.log(selectedAccounts);

  return (
    <div className={styles.sidebar}>
      <h2>Records</h2>
      <button onClick={() => setAddRecords(true)} className={styles.addButton}>
        + Add
      </button>

      <h4 style={{ fontWeight: "500" }}>FILTER</h4>

      {/* 🔽 Accounts Section */}
      <div>
        <div
          onClick={() => setExpandedAccounts(!expandedAccounts)}
          className={styles.sectionHeader}
        >
          {expandedAccounts ? <FaAngleDown /> : <FaAngleRight />} Accounts
        </div>

        {expandedAccounts && (
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account._id} className={styles.clickingCategory}>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccountSelection(account.accountName);
                  }}
                >
                  {selectedAccounts.includes(account.accountName) ? (
                    <MdCheckBox color="blue" />
                  ) : (
                    <MdCheckBoxOutlineBlank />
                  )}
                </span>
                {account.accountName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔽 Categories Section */}
      <div>
        <div
          onClick={() =>
            setExpandedCategoriesSection(!expandedCategoriesSection)
          }
          className={styles.sectionHeader}
        >
          {expandedCategoriesSection ? <FaAngleDown /> : <FaAngleRight />}{" "}
          Categories
        </div>

        {expandedCategoriesSection && (
          <div className={styles.categoriesList}>
            {categories.map((category) => (
              <div key={category._id}>
                <div
                  onClick={() => toggleCategoryExpand(category._id)}
                  className={styles.clickingCategory}
                >
                  {expandedCategories[category._id] ? (
                    <FaAngleDown />
                  ) : (
                    <FaAngleRight />
                  )}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelection(category.categoryName);
                    }}
                  >
                    {selectedCategory.includes(category.categoryName) ? (
                      <MdCheckBox color="blue" />
                    ) : (
                      <MdCheckBoxOutlineBlank />
                    )}
                  </span>
                  {category.categoryName}
                </div>

                {expandedCategories[category._id] && (
                  <div className={styles.subCategory}>
                    {category.subCategories?.map((sub) => (
                      <div
                        key={sub._id}
                        className={styles.clickingCategory}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubCategorySelection(sub.subCategoryName);
                        }}
                      >
                        {selectedCategory.includes(sub.subCategoryName) ? (
                          <MdCheckBox color="blue" />
                        ) : (
                          <MdCheckBoxOutlineBlank />
                        )}
                        <span>{sub.subCategoryName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* more filtersss */}
      {FILTERS.map((filter) => {
        let selectedState, setSelectedState, allLabel;

        if (filter.categoryName === "Record Type") {
          selectedState = selectedRecordTypes;
          setSelectedState = setSelectedRecordTypes;
          allLabel = "All Records";
        } else if (filter.categoryName === "Payment Type") {
          selectedState = selectedPaymentTypes;
          setSelectedState = setSelectedPaymentTypes;
          allLabel = "All Payment Types";
        } else if (filter.categoryName === "Payment Status") {
          selectedState = selectedStatuses;
          setSelectedState = setSelectedStatuses;
          allLabel = "All";
        }

        const handleSelection = (item) => {
          setSelectedState((prev) => {
            if (item === allLabel) {
              // ✅ Toggle "All" selection
              if (prev.includes(allLabel)) return []; // Deselect all
              return [allLabel, ...filter.subCategories.map((sub) => sub.name)];
            }

            const updatedSelection = prev.includes(item)
              ? prev.filter((p) => p !== item)
              : [...prev, item];

            // ✅ Auto-select "All" if all subcategories are selected
            const allSubcategories = filter.subCategories.map(
              (sub) => sub.name
            );
            return allSubcategories.every((sub) =>
              updatedSelection.includes(sub)
            )
              ? [allLabel, ...updatedSelection]
              : updatedSelection;
          });
        };

        return (
          <div key={filter.id}>
            <div
              onClick={() =>
                setExpandedFilters((prev) => ({
                  ...prev,
                  [filter.id]: !prev[filter.id],
                }))
              }
              className={styles.sectionHeader}
            >
              {expandedFilters[filter.id] ? <FaAngleDown /> : <FaAngleRight />}{" "}
              {filter.categoryName}
            </div>

            {expandedFilters[filter.id] && (
              <div className={styles.filtersList}>
                {/* "All" Option */}
                {/* <div key={allLabel} className={styles.clickingCategory}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelection(allLabel);
                    }}
                  >
                    {selectedState.includes(allLabel) ? (
                      <MdCheckBox color="blue" />
                    ) : (
                      <MdCheckBoxOutlineBlank />
                    )}
                  </span>
                  {allLabel}
                </div> */}

                {/* Subcategories */}
                {filter.subCategories.map((sub) => (
                  <div key={sub.id} className={styles.clickingCategory}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelection(sub.name);
                      }}
                    >
                      {selectedState.includes(sub.name) ? (
                        <MdCheckBox color="blue" />
                      ) : (
                        <MdCheckBoxOutlineBlank />
                      )}
                    </span>
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
