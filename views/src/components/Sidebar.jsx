import React, { useEffect, useState } from "react";
import styles from "../css/sidebar.module.css";
import { FaAngleDown } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { getCategories } from "../utils/categoryUtils";
import { getAccounts } from "../utils/accountUtils";
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
  const [expandedCategories, setExpandedCategories] = useState({});
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

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategorySelection = (categoryName) => {
    setSelectedCategory((prev) =>
      prev.includes(categoryName)
        ? prev.filter((item) => item !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSubCategorySelection = (subCategoryName) => {
    setSelectedCategory((prev) =>
      prev.includes(subCategoryName)
        ? prev.filter((item) => item !== subCategoryName)
        : [...prev, subCategoryName]
    );
  };

  const handleAccountSelection = (accountName) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountName)
        ? prev.filter((item) => item !== accountName)
        : [...prev, accountName]
    );
  };

  const CheckboxIcon = ({ checked }) => (
    <span
      className={`${styles.checkbox} ${checked ? "" : styles.checkboxOff}`}
      aria-hidden="true"
    >
      {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
    </span>
  );

  const rowClass = (checked) =>
    `${styles.row} ${checked ? styles.rowChecked : ""}`;

  return (
    <div className={styles.sidebar}>
      <div className="card">
        <div className={styles.cardTitle}>Filters</div>

        {/* Accounts */}
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            aria-expanded={expandedAccounts}
            onClick={() => setExpandedAccounts(!expandedAccounts)}
          >
            <span className={styles.sectionLabel}>Accounts</span>
            <span
              className={`${styles.chevron} ${
                expandedAccounts ? styles.chevronOpen : ""
              }`}
              aria-hidden="true"
            >
              <FaAngleDown />
            </span>
          </button>

          {expandedAccounts && (
            <div className={styles.sectionBody} role="group" aria-label="Accounts">
              {accounts.map((account) => {
                const checked = selectedAccounts.includes(account.accountName);
                return (
                  <label key={account._id} className={rowClass(checked)}>
                    <input
                      type="checkbox"
                      className={styles.nativeCheckbox}
                      checked={checked}
                      onChange={() =>
                        handleAccountSelection(account.accountName)
                      }
                    />
                    <CheckboxIcon checked={checked} />
                    <span className={styles.rowLabel}>{account.accountName}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className={styles.section}>
          <button
            type="button"
            className={styles.sectionHeader}
            aria-expanded={expandedCategoriesSection}
            onClick={() =>
              setExpandedCategoriesSection(!expandedCategoriesSection)
            }
          >
            <span className={styles.sectionLabel}>Categories</span>
            <span
              className={`${styles.chevron} ${
                expandedCategoriesSection ? styles.chevronOpen : ""
              }`}
              aria-hidden="true"
            >
              <FaAngleDown />
            </span>
          </button>

          {expandedCategoriesSection && (
            <div
              className={styles.sectionBody}
              role="group"
              aria-label="Categories"
            >
              {categories.map((category) => {
                const checked = selectedCategory.includes(
                  category.categoryName
                );
                return (
                  <div key={category._id} className={styles.rowGroup}>
                    <div className={styles.rowWrap}>
                      <button
                        type="button"
                        className={styles.expandBtn}
                        aria-expanded={!!expandedCategories[category._id]}
                        onClick={() => toggleCategoryExpand(category._id)}
                      >
                        <span
                          className={`${styles.chevron} ${
                            expandedCategories[category._id]
                              ? styles.chevronOpen
                              : ""
                          }`}
                          aria-hidden="true"
                        >
                          <FaAngleDown />
                        </span>
                        <span className="visually-hidden">
                          {expandedCategories[category._id]
                            ? "Hide"
                            : "Show"}{" "}
                          subcategories of {category.categoryName}
                        </span>
                      </button>
                      <label className={rowClass(checked)}>
                        <input
                          type="checkbox"
                          className={styles.nativeCheckbox}
                          checked={checked}
                          onChange={() =>
                            handleCategorySelection(category.categoryName)
                          }
                        />
                        <CheckboxIcon checked={checked} />
                        <span className={styles.rowLabel}>
                          {category.categoryName}
                        </span>
                      </label>
                    </div>

                    {expandedCategories[category._id] && (
                      <div
                        className={styles.subRows}
                        role="group"
                        aria-label={`${category.categoryName} subcategories`}
                      >
                        {category.subCategories?.map((sub) => {
                          const subChecked = selectedCategory.includes(
                            sub.subCategoryName
                          );
                          return (
                            <label
                              key={sub._id}
                              className={rowClass(subChecked)}
                            >
                              <input
                                type="checkbox"
                                className={styles.nativeCheckbox}
                                checked={subChecked}
                                onChange={() =>
                                  handleSubCategorySelection(
                                    sub.subCategoryName
                                  )
                                }
                              />
                              <CheckboxIcon checked={subChecked} />
                              <span className={styles.rowLabel}>
                                {sub.subCategoryName}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Record type / payment type / status filters */}
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
                if (prev.includes(allLabel)) return [];
                return [allLabel, ...filter.subCategories.map((sub) => sub.name)];
              }

              const updatedSelection = prev.includes(item)
                ? prev.filter((p) => p !== item)
                : [...prev, item];

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
            <div key={filter.id} className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                aria-expanded={!!expandedFilters[filter.id]}
                onClick={() =>
                  setExpandedFilters((prev) => ({
                    ...prev,
                    [filter.id]: !prev[filter.id],
                  }))
                }
              >
                <span className={styles.sectionLabel}>
                  {filter.categoryName}
                </span>
                <span
                  className={`${styles.chevron} ${
                    expandedFilters[filter.id] ? styles.chevronOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <FaAngleDown />
                </span>
              </button>

              {expandedFilters[filter.id] && (
                <div
                  className={styles.sectionBody}
                  role="group"
                  aria-label={filter.categoryName}
                >
                  {filter.subCategories.map((sub) => {
                    const checked = selectedState.includes(sub.name);
                    return (
                      <label key={sub.id} className={rowClass(checked)}>
                        <input
                          type="checkbox"
                          className={styles.nativeCheckbox}
                          checked={checked}
                          onChange={() => handleSelection(sub.name)}
                        />
                        <CheckboxIcon checked={checked} />
                        <span className={styles.rowLabel}>{sub.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
