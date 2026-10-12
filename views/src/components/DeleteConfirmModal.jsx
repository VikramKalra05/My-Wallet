import React, { useEffect, useRef } from "react";
import styles from "../css/ConfirmationModal.module.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;

      // Keep Tab inside the dialog while it is open.
      const focusable = modalRef.current.querySelectorAll("button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.icon} aria-hidden="true">
          !
        </div>
        <p id="confirm-dialog-title" className={styles.heading}>
          {message || "Are you sure?"}
        </p>
        <p className={styles.subtext}>This action can't be undone.</p>
        <div className={styles.actions}>
          <button
            type="button"
            className={`btn btn--secondary ${styles.button}`}
            onClick={onCancel}
            ref={cancelRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn--danger ${styles.button}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
