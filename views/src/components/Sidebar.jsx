import React, { useContext, useState } from "react";
import styles from "../css/sidebar.module.css";
import { CATEGORIES } from "../utils/categories";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import AppContext from "../context/AppContext";

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const { setAddRecords } = useContext(AppContext);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});

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

      <h4 className={styles.filterHeading}>FILTER</h4>

      {CATEGORIES.map((category) => {
        const isCategorySelected = selectedCategory.includes(category.categoryName);
        const subCategoryNames = category.subCategories?.map((sub) => sub.name) || [];

        return (
          <div key={category.id}>
            {/* Main Category - Click anywhere to expand/collapse */}
            <div className={styles.category} onClick={() => toggleCategoryExpand(category.id)}>
              <span>
                {expandedCategories[category.id] ? <FaAngleDown color="green" /> : <FaAngleRight />}
              </span>
            
              <span>{category.categoryName}</span>
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
                            handleSubCategorySelection(sub.name, category.categoryName, subCategoryNames);
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
        );
      })}
    </div>
  );
};

export default Sidebar;

