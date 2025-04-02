import React, { useContext, useState } from "react";
import styles from "../css/sidebar.module.css";
import { CATEGORIES } from "../utils/categories";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import AppContext from "../context/AppContext";
import { getCategories } from "../utils/categoryUtils";

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

  const toggleCategory = (categoryId, categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSubCategory = (subCategoryId, name) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
    handleCategorySelection(name);
  };
  const handleCategorySelection = (name) => {
    setSelectedCategory((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name); // Remove if already selected
      } else {
        return [...prev, name]; // Add if not selected
      }
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
              toggleCategory(category.id);
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

          {/* Show Subcategories if expanded */}
          {expandedCategories[category.id] && (
            <div className={styles.subCategory}>
              {category.subCategories?.map((sub) => (
                <div key={sub.id}>
                  <div
                    onClick={() => {
                      toggleSubCategory(sub.id, sub.name);
                    }}
                    className={styles.clickingCategory}
                    style={{
                      color: selectedCategory.includes(sub.name)
                        ? "blue"
                        : "black",
                    }}
                    // Updated to change color if selected
                  >
                    {sub.subCategories ? (
                      expandedSubCategories[sub.id] ? (
                        <FaAngleDown color="green" /> // Added color change when expanded
                      ) : (
                        <FaAngleRight />
                      )
                    ) : (
                      "•"
                    )}{" "}
                    {sub.name}
                  </div>

                  {/* Show nested subcategories if expanded  */}
                  {sub.subCategories && expandedSubCategories[sub.id] && (
                    <div className={styles.nestedSubCategory}>
                      {sub.subCategories.map((nested) => (
                        <div
                          key={nested.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategorySelection(nested.name);
                          }}
                          style={{
                            color: selectedCategory.includes(nested.name)
                              ? "blue"
                              : "black",
                          }}
                          // Updated to change color if selected
                        >
                          • {nested.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
