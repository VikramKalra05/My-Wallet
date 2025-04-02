import React, { useContext, useState } from "react";
import styles from "../css/sidebar.module.css";
import { CATEGORIES } from "../utils/categories";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { getCategories } from "../utils/categoryUtils";
import AppContext from "../context/AppContext";

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const { setAddRecords } = useContext(AppContext);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await getCategories();
    if (res) {
      setCategories(res);
    } else {
      // toast to show error TBD
    }
  };

  // Expand/collapse main category
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Expand/collapse subcategory
  const toggleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
  };

  // // Handle selection/deselection of main category
  // const handleCategorySelection = (categoryName, subCategories = []) => {
  //   setSelectedCategory((prev) => {
  //     let updated = [...prev];

  //     if (updated.includes(categoryName)) {
  //       return updated.filter((item) => item !== categoryName && !subCategories.includes(item));
  //     } else {
  //       return [...updated, categoryName, ...subCategories];
  //     }
  //   });
  // };

  // Handle selection/deselection of subcategory
  const handleSubCategorySelection = (subCategoryName, parentCategory, siblingSubCategories = []) => {
    setSelectedCategory((prev) => {
      let updated = prev.includes(subCategoryName)
        ? prev.filter((item) => item !== subCategoryName)
        : [...prev, subCategoryName];
  
      const hasSelectedSiblings = siblingSubCategories.some((sub) => updated.includes(sub));
  
      return hasSelectedSiblings ? updated : updated.filter((item) => item !== parentCategory);
    });
  };

  return (
    <div className={styles.sidebar}>
      <h2>Records</h2>
      <button onClick={() => setAddRecords(true)} className={styles.addButton}>
        + Add
      </button>

      <h4 style={{ fontWeight: "500" }}>FILTER</h4>
      <div>
        <p
          onClick={fetchCategories}
          style={{
            backgroundColor: "green",
            color: "white",
          }}
        >
          Categories
        </p>

        <div>
          {categories.length > 0 &&
            categories.map((category) => {
              return (
                <div key={category._id}>
                  <p style={{ fontSize: "14px", fontWeight: "700" }}>{category?.categoryName}</p>
                  <div>
                    {category?.subCategories?.length > 0 &&
                      category?.subCategories?.map((sub) => {
                        return (
                          <div key={sub._id}>
                            <p style={{ fontSize: "12px" }}>
                              {sub?.subCategoryName}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {CATEGORIES.map((category) => (
        <div key={category.id}>
          {/* Main category */}
          <div
            onClick={() => {
              toggleCategoryExpand(category.id);
            }}
            className={styles.clickingCategory}
          >
            {expandedCategories[category.id] ? (
              <FaAngleDown color="green" /> // Added color change when expanded
            ) : (
              <FaAngleRight />
            )}{" "}
            {category.categoryName}
          </div>

            {/* Subcategories */}
            {expandedCategories[category.id] && (
              <div className={styles.subCategory}>
                {category.subCategories?.map((sub) => {
                  const isSubSelected = selectedCategory.includes(sub.name);
                  const nestedSubNames = sub.subCategories?.map((nested) => nested.name) || [];

                  return (
                    <div key={sub.id}>
                      <div
                        className={styles.clickingCategory}
                        onClick={() => toggleSubCategoryExpand(sub.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubCategorySelection(sub.name, category.categoryName, nestedSubNames);
                          }}
                        >
                          {isSubSelected ? <MdCheckBox color="blue" /> : <MdCheckBoxOutlineBlank />}
                        </span>
                        <span>{sub.name}</span>
                        {sub.subCategories && (
                          <span style={{ marginLeft: "8px" }}>
                            {expandedSubCategories[sub.id] ? <FaAngleDown color="green" /> : <FaAngleRight />}
                          </span>
                        )}
                      </div>

                      {/* Nested Subcategories */}
                      {sub.subCategories && expandedSubCategories[sub.id] && (
                        <div className={styles.nestedSubCategory}>
                          {sub.subCategories.map((nested) => {
                            const isNestedSelected = selectedCategory.includes(nested.name);
                            return (
                              <div
                                key={nested.id}
                                className={styles.clickingCategory}
                                onClick={() => handleSubCategorySelection(nested.name, sub.name, nestedSubNames)}
                              >
                                <span>
                                  {isNestedSelected ? <MdCheckBox color="blue" /> : <MdCheckBoxOutlineBlank />}
                                </span>
                                <span>• {nested.name}</span>
                              </div>
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
        )
      )}
    </div>
  );
};

export default Sidebar;

