import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/settings.module.css";
import { AuthContext } from "../context/AuthContext";
import { updateUserDetails } from "../utils/userUtils";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { getCategories, updateSubCategory } from "../utils/categoryUtils";
import categoryIcons from "../constants/categoryIcons";
import { deleteSubCategory } from "../utils/categoryUtils";

const Settings = () => {
  const { userDetails, setUserDetails, handleFetchUserDetails } =
    useContext(AuthContext);
  const [selectedPfp, setSelectedPfp] = useState(null);
  const [photo, setPhoto] = useState(userDetails?.photo);
  const fileInputRef = useRef(null);

  // ✅ Added: State to manage which tab is active
  const [selectedTab, setSelectedTab] = useState("profile"); // 'profile', 'categories', 'labels'

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const activeCategoryRef = useRef(null);

  // ✅ Track which subcategory is being edited
  const [editingSubId, setEditingSubId] = useState(null);
  const [editedSubName, setEditedSubName] = useState("");
  const [originalSubName, setOriginalSubName] = useState("");
  const [formData, setFormData] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedPfp(event.target.files[0]);
      setPhoto(URL.createObjectURL(event.target.files[0]));
    } else {
      console.error("No file selected");
    }
  };

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFile = async () => {
    if (selectedPfp) {
      const formdataNew = new FormData();
      formdataNew.append("photo", selectedPfp);

      // If you need to send name, email, etc., add them here:
      for (let pair of formdataNew.entries()) {
        console.log(pair[0], pair[1]); // Logs key-value pairs
      }

      setFormData(formdataNew);
    }
  };

  const handleSaveAccChanges = async () => {
    try {
      if (formData) {
        console.log(formData);
        await updateUserDetails(formData);
        await handleFetchUserDetails();
      }
    } catch (error) {
      console.log(error);
      // toast
    }
  };

  useEffect(() => {
    uploadFile();
  }, [selectedPfp]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    activeCategoryRef.current = activeCategoryId;
  }, [activeCategoryId]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      console.log("Fetched categories:", res);
      if (res) {
        setCategories(res);
        const stillExists = res.find(
          (cat) => cat._id === activeCategoryRef.current
        );
        if (!stillExists && res.length > 0) {
          setActiveCategoryId(res[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (catId, subId) => {
    try {
      const res = await deleteSubCategory(catId, subId);
      if (res) {
        console.log("subcategory deleted:", res);

        await fetchCategories();
        //toast
      } else {
        //toast
        return null;
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleEditClick = (subId, currentName) => {
    setEditingSubId(subId);
    setEditedSubName(currentName);
    setOriginalSubName(currentName);
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => {
    setEditingSubId(null);
    setEditedSubName("");
    setOriginalSubName("");
  };

  // ✅ Save changes
  const handleSaveEdit = async (catId, subId) => {
    if (editedSubName.trim() && editedSubName !== originalSubName) {
      const updated = await updateSubCategory(catId, subId, {
        subCategoryName: editedSubName,
      });
      if (updated) {
        await fetchCategories();
      }
    }
    setEditingSubId(null);
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingCont}>
        {/* <div className={styles.settingHeader}>User Settings</div> */}

        {/* ✅ Added: Tab bar to switch between different setting sections */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${
              selectedTab === "profile" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("profile")}
          >
            Profile Settings
          </button>
          <button
            className={`${styles.tabButton} ${
              selectedTab === "categories" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("categories")}
          >
            Categories
          </button>
          <button
            className={`${styles.tabButton} ${
              selectedTab === "labels" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("labels")}
          >
            Labels
          </button>
        </div>

        <div className={styles.settingMain}>
          {/* ✅ Moved profile UI inside a conditional tab */}
          {selectedTab === "profile" && (
            <div className={styles.profileContainer}>
              {/* Left Profile Photo */}
              <div className={styles.profileSidebar}>
                <div className={styles.profileImageWrapper}>
                  <img
                    src={photo || userDetails?.photo}
                    alt="Profile"
                    className={styles.profilePic}
                    loading="lazy"
                  />
                  <button
                    className={styles.editIconBtn}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPencilAlt size={14} />
                  </button>
                </div>

                <input
                  className="inputTag"
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  className={styles.updatePhotoBtn}
                  onClick={handleUploadFile}
                >
                  UPDATE PHOTO
                </button>
              </div>

              {/* Right Profile Form */}
              <div className={styles.profileForm}>
                <h2 className={styles.profileHeading}>Profile</h2>

                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm password" />
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSaveAccChanges}
                  >
                    Save Changes
                  </button>
                </div>
                <div className={styles.deleteBtnWrapper}>
                  <button className={styles.deleteBtn}>
                    <MdDelete className={styles.deleteicon} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ✅ Added: Placeholder for Categories tab */}
          {selectedTab === "categories" && (
            <div className={styles.categoryContainer}>
              {/* Category Tabs (left) */}
              <div className={styles.categoryTabs}>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setActiveCategoryId(cat._id)}
                    className={`${styles.categoryTab} ${
                      activeCategoryId === cat._id
                        ? styles.categoryTabActive
                        : ""
                    }`}
                  >
                    {categoryIcons[cat.categoryName]}
                    <span>{cat.categoryName}</span>
                  </div>
                ))}
              </div>

              {/* Subcategories (right) */}
              <div className={styles.subcategoryList}>
                {(
                  categories.find((cat) => cat._id === activeCategoryId)
                    ?.subCategories || []
                ).map((sub) => (
                  <div key={sub._id} className={styles.subcategoryItem}>
                    <div className={styles.subName}>
                      {
                        categoryIcons[
                          categories.find((cat) => cat._id === activeCategoryId)
                            ?.categoryName
                        ]
                      }

                      <div>{sub.subCategoryName}</div>
                    </div>
                    <div className={styles.editButtons}>
                      {/* if the subcategory is not the one being edited right now then only delete button wil be displayed */}
                      {editingSubId !== sub._id && (
                        <button
                          className={styles.delete}
                          onClick={() =>
                            handleDelete(activeCategoryId, sub._id)
                          }
                        >
                          <MdDelete className={styles.delete} size={18} />
                        </button>
                      )}

                      {/* editing part...  */}

                      {editingSubId === sub._id ? (
                        <div className={styles.inlineEditRow}>
                          <input
                            type="text"
                            value={editedSubName}
                            onChange={(e) => setEditedSubName(e.target.value)}
                            className={styles.editInput}
                          />
                          <button
                            className={styles.saveButton}
                            onClick={() =>
                              handleSaveEdit(activeCategoryId, sub._id)
                            }
                          >
                            Save
                          </button>
                          <button
                            className={styles.cancelBtn}
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className={styles.subcategoryRow}>
                          <button
                            className={styles.edit}
                            onClick={() =>
                              handleEditClick(sub._id, sub.subCategoryName)
                            }
                          >
                            <FaPencilAlt className={styles.edit} size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ✅ Added: Placeholder for Labels tab */}
          {selectedTab === "labels" && (
            <div className={styles.placeholderTab}>
              <h3>Label Settings</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
