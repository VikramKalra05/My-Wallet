import { useContext, useEffect, useRef, useState } from "react";
import styles from "../css/settings.module.css";
import { AuthContext } from "../context/AuthContext";
import { updateUserDetails } from "../utils/userUtils";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { getCategories, updateSubCategory } from "../utils/categoryUtils";
import categoryIcons from "../constants/categoryIcons";
import { deleteSubCategory } from "../utils/categoryUtils";
import ConfirmationModal from "../components/DeleteConfirmModal";
import { deleteUserDetails } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";

const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profile Settings",
    tabId: "settings-tab-profile",
    panelId: "settings-panel-profile",
  },
  {
    id: "categories",
    label: "Categories",
    tabId: "settings-tab-categories",
    panelId: "settings-panel-categories",
  },
];

const Settings = () => {
  const { userDetails, setUserDetails, handleFetchUserDetails, setIsAuthenticated } =
    useContext(AuthContext);
  const [selectedPfp, setSelectedPfp] = useState(null);
  const [photo, setPhoto] = useState(userDetails?.photo);
  const fileInputRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("profile"); // 'profile' | 'categories'

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const activeCategoryRef = useRef(null);
  const [nameInput, setNameInput] = useState(userDetails?.name || "");
  const [emailInput, setEmailInput] = useState(userDetails?.email || "");

  useEffect(() => {
    setNameInput(userDetails?.name || "");
    setEmailInput(userDetails?.email || "");
  }, [userDetails]);

  // Track which subcategory is being edited
  const [editingSubId, setEditingSubId] = useState(null);
  const [editedSubName, setEditedSubName] = useState("");
  const [originalSubName, setOriginalSubName] = useState("");
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false); //modal for deletion
  const [deleteError, setDeleteError] = useState(false);
  const [showConfirmModalForSubCategory, setShowConfirmModalForSubCategory] =
    useState(false); //modal for deletion
  const [currentSubId, setCurrentSubId] = useState(null);

  // Inline save feedback (replaces the unimplemented `// toast` placeholders)
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const statusTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(statusTimerRef.current);
  }, []);

  const flashStatus = (message) => {
    setSaveError("");
    setSaveStatus(message);
    clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setSaveStatus(""), 4000);
  };

  const flashError = (message) => {
    clearTimeout(statusTimerRef.current);
    setSaveStatus("");
    setSaveError(message);
  };

  const isDirty =
    Boolean(selectedPfp) ||
    nameInput !== (userDetails?.name || "") ||
    emailInput !== (userDetails?.email || "");

  const handleDeletion = async () => {
    try {
      setDeleteError(false);
      const res = await deleteUserDetails();
      if (res.message === "Account deleted successfully") {
        // clear cookie = token
        setUserDetails({})
        setIsAuthenticated(null)
        return navigate("/");
      }
      setDeleteError(true);
    } catch (error) {
      setDeleteError(true);
    }
  };
  const handleConfirm = async () => {
    await handleDeletion();
    setShowConfirmModal(false);
  };
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

  const handleSaveAccChanges = async () => {
    try {
      // Built here from the current inputs: it used to be built only when a
      // photo was picked, so name/email edits were silently dropped
      const formdataNew = new FormData();
      if (selectedPfp) {
        formdataNew.append("photo", selectedPfp);
      }
      if (nameInput && nameInput !== userDetails?.name) {
        formdataNew.append("name", nameInput);
      }
      if (emailInput && emailInput !== userDetails?.email) {
        formdataNew.append("email", emailInput);
      }

      if ([...formdataNew.entries()].length === 0) {
        flashStatus("No changes to save.");
        return; // nothing changed
      }

      const res = await updateUserDetails(formdataNew);
      if (!res) {
        flashError("Couldn't save your changes. Please try again.");
        return;
      }
      await handleFetchUserDetails();
      setSelectedPfp(null);
      flashStatus("Changes saved");
    } catch (error) {
      console.error(error);
      flashError("Couldn't save your changes. Please try again.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    activeCategoryRef.current = activeCategoryId;
  }, [activeCategoryId]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
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
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (subId) => {
    try {
      const res = await deleteSubCategory(activeCategoryId, subId);
      if (res) {
        await fetchCategories();
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleConfirmation = () => {
    if (currentSubId) {
      handleDelete(currentSubId);
    }
    setShowConfirmModalForSubCategory(false);
  };

  const handleEditClick = (subId, currentName) => {
    setEditingSubId(subId);
    setEditedSubName(currentName);
    setOriginalSubName(currentName);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingSubId(null);
    setEditedSubName("");
    setOriginalSubName("");
  };

  // Save changes
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

  const activeCategory = categories.find(
    (cat) => cat._id === activeCategoryId
  );
  const subCategories = activeCategory?.subCategories || [];

  return (
    <div className="page">
      <div className="app-container">
        <h1 className={styles.pageTitle}>Settings</h1>
        <div
          className={styles.tabBar}
          role="tablist"
          aria-label="Settings sections"
        >
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={tab.tabId}
              role="tab"
              aria-selected={selectedTab === tab.id}
              aria-controls={tab.panelId}
              className={`${styles.tabButton} ${
                selectedTab === tab.id ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile panel */}
        <div
          className={`card ${styles.panel} ${styles.profileContainer}`}
          id="settings-panel-profile"
          role="tabpanel"
          aria-labelledby="settings-tab-profile"
          hidden={selectedTab !== "profile"}
        >
          <div className={styles.profileSidebar}>
            <div className={styles.profileImageWrapper}>
              {photo || userDetails?.photo ? (
                <img
                  src={photo || userDetails?.photo}
                  alt={
                    userDetails?.name
                      ? `${userDetails.name}'s profile photo`
                      : "Profile photo"
                  }
                  className={styles.profilePic}
                  loading="lazy"
                />
              ) : (
                <div className={styles.profilePicFallback} aria-hidden="true">
                  {(userDetails?.name || "?").trim().charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                className={styles.editIconBtn}
                aria-label="Change profile photo"
                onClick={handleUploadFile}
              >
                <FaPencilAlt size={14} aria-hidden="true" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleUploadFile}
            >
              Update photo
            </button>
          </div>

          <div className={styles.profileForm}>
            <h2 className="section-title">Profile</h2>

            <div className={styles.inputGrid}>
              <div className="field">
                <label className="field__label" htmlFor="settings-name">
                  Name
                </label>
                <input
                  id="settings-name"
                  className="field__input"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="settings-email">
                  Email
                </label>
                <input
                  id="settings-email"
                  className="field__input"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            <p className={styles.passwordNote}>
              Password changes aren't available yet.
            </p>

            <div className={styles.actionRow}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSaveAccChanges}
              >
                Save Changes
              </button>
              {isDirty && (
                <span className={styles.dirtyHint}>You have unsaved changes</span>
              )}
            </div>

            {saveStatus && (
              <p className={styles.saveStatus} role="status">
                {saveStatus}
              </p>
            )}
            {saveError && (
              <p className={`form-error ${styles.saveError}`} role="alert">
                {saveError}
              </p>
            )}

            <div className={styles.dangerZone}>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  setShowConfirmModal(true);
                }}
              >
                <MdDelete aria-hidden="true" />
                Delete Account
              </button>
              {deleteError && (
                <p className="form-error" role="alert">
                  Couldn't delete your account. Please try again.
                </p>
              )}
            </div>

            {showConfirmModal && (
              <ConfirmationModal
                message="Are you sure you want to delete this account?"
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
              />
            )}
          </div>
        </div>

        {/* Categories panel */}
        <div
          className={`card ${styles.panel} ${styles.categoryContainer}`}
          id="settings-panel-categories"
          role="tabpanel"
          aria-labelledby="settings-tab-categories"
          hidden={selectedTab !== "categories"}
        >
          <div
            className={styles.categoryTabs}
            role="group"
            aria-label="Categories"
          >
            {categories.length === 0 ? (
              <p className={styles.emptyNote}>No categories yet.</p>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  aria-pressed={activeCategoryId === cat._id}
                  className={`${styles.categoryTab} ${
                    activeCategoryId === cat._id ? styles.categoryTabActive : ""
                  }`}
                  onClick={() => setActiveCategoryId(cat._id)}
                >
                  <span className={styles.rowIcon} aria-hidden="true">
                    {categoryIcons[cat.categoryName]}
                  </span>
                  <span className={styles.categoryTabLabel}>
                    {cat.categoryName}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className={styles.subcategoryList}>
            {subCategories.length === 0 ? (
              <div className="state-block">
                <p className="state-block__title">No subcategories</p>
                <p className="state-block__text">
                  Nothing here for this category yet.
                </p>
              </div>
            ) : (
              subCategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`${styles.subcategoryItem} ${
                    editingSubId === sub._id
                      ? styles.subcategoryItemEditing
                      : ""
                  }`}
                >
                  <div className={styles.subName}>
                    <span className={styles.rowIcon} aria-hidden="true">
                      {categoryIcons[activeCategory?.categoryName]}
                    </span>
                    <span className={styles.subNameText}>
                      {sub.subCategoryName}
                    </span>
                  </div>

                  <div className={styles.editButtons}>
                    {/* while renaming, only the inline editor is shown */}
                    {editingSubId !== sub._id && (
                      <>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          aria-label={`Delete ${sub.subCategoryName}`}
                          onClick={() => {
                            setCurrentSubId(sub._id);
                            setShowConfirmModalForSubCategory(true);
                          }}
                        >
                          <MdDelete size={18} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label={`Edit ${sub.subCategoryName}`}
                          onClick={() =>
                            handleEditClick(sub._id, sub.subCategoryName)
                          }
                        >
                          <FaPencilAlt size={15} aria-hidden="true" />
                        </button>
                      </>
                    )}

                    {editingSubId === sub._id && (
                      <div className={styles.inlineEditRow}>
                        <label
                          className="visually-hidden"
                          htmlFor={`settings-rename-${sub._id}`}
                        >
                          Subcategory name
                        </label>
                        <input
                          id={`settings-rename-${sub._id}`}
                          type="text"
                          value={editedSubName}
                          onChange={(e) => setEditedSubName(e.target.value)}
                          className={`field__input ${styles.editInput}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // prevent accidental form submission
                              handleSaveEdit(activeCategoryId, sub._id);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          onClick={() =>
                            handleSaveEdit(activeCategoryId, sub._id)
                          }
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {showConfirmModalForSubCategory && (
              <ConfirmationModal
                message="Are you sure you want to delete this subcategory?"
                onConfirm={handleConfirmation}
                onCancel={() => setShowConfirmModalForSubCategory(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
