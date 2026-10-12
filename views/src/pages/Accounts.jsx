import { useState, useEffect } from "react";
import AccountCard from "../components/AccountCard";
import styles from "../css/accounts.module.css";
import { getAccounts } from "../utils/accountUtils";
import AddAccountModal from "../components/AddAccountModal";
import { Skeleton } from "@mui/material";

const Accounts = () => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getAccounts();
      if (res?.accounts) {
        setAccounts(res.accounts);
        setError("");
      } else {
        setError("Something went wrong fetching accounts.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderSkeletons = () => {
    return Array(8)
      .fill()
      .map((_, index) => (
        <div key={index} className={styles.accountSkeleton}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={104}
            animation="wave"
          />
        </div>
      ));
  };

  return (
    <div className="page">
      <div className="app-container">
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Accounts</h1>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setShowAddAccountModal(true)}
          >
            + Add account
          </button>
        </header>

        {showAddAccountModal && (
          <AddAccountModal
            accounts={accounts}
            setAccounts={setAccounts}
            showAddAccountModal={showAddAccountModal}
            setShowAddAccountModal={setShowAddAccountModal}
          />
        )}

        {loading && (
          <div className={styles.accountsGrid} role="status">
            <span className="visually-hidden">Loading accounts</span>
            {renderSkeletons()}
          </div>
        )}

        {!loading && error && (
          <div className="state-block" role="alert">
            <p className="state-block__text">{error}</p>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={fetchAccounts}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && accounts?.length === 0 && (
          <div className="state-block">
            <span className="state-block__icon" aria-hidden="true">
              🫥
            </span>
            <p className="state-block__title">No accounts yet</p>
            <p className="state-block__text">
              Create an account to start tracking your money.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowAddAccountModal(true)}
            >
              + Add account
            </button>
          </div>
        )}

        {!loading && !error && accounts?.length > 0 && (
          <div className={styles.accountsGrid}>
            {accounts.map((account) => (
              <AccountCard
                key={account._id}
                account={account}
                fetchAccounts={fetchAccounts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
