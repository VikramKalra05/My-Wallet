const { AnalyticsModel } = require("../models/analyticsModel");
const moment = require("moment-timezone");

const APP_TZ = "Asia/Kolkata";

function getPeriodInfo(transactionDate, type = "month") {
  const date = moment.tz(transactionDate, APP_TZ);

  if (type === "month") {
    return {
      periodType: "month",
      periodId: date.format("YYYY-MM"), // e.g., "2025-04"
      startDate: date.startOf("month").toDate(),
      endDate: date.endOf("month").toDate(),
    };
  } else if (type === "week") {
    return {
      periodType: "week",
      periodId: date.format("GGGG-[W]WW"), // e.g., "2025-W15"
      startDate: date.startOf("week").toDate(),
      endDate: date.endOf("week").toDate(),
    };
  } else if (type === "year") {
    return {
      periodType: "year",
      periodId: date.format("YYYY"),
      startDate: date.startOf("year").toDate(),
      endDate: date.endOf("year").toDate(),
    };
  }
}

const updateAnalyticsDoc = async ({
  userId,
  category,
  subcategory,
  amount,
  type,
  periodId,
  periodType,
  startDate,
  endDate,
}) => {
  try {
    // Validate that all required fields are present
    if (!startDate || !endDate || !periodId || !periodType) {
      console.error(
        "Missing required fields: startDate, endDate, periodId, periodType"
      );
      // Handle the error as necessary, e.g., throw an error or return early
      throw new Error("Analytics update failed: Missing required fields");
    }

    const doc = await AnalyticsModel.findOne({
      userId,
      periodId,
      periodType,
    });

    if (!doc) {
      // Nothing recorded for this period yet: a reversal (delete/update of an
      // older transaction) has nothing to subtract, so don't create a doc with
      // negative totals.
      if (amount < 0) {
        return;
      }

      await AnalyticsModel.create({
        userId,
        totalIncome: type === "Income" ? amount : 0,
        totalExpense: type === "Expense" ? amount : 0,
        categoryBreakdown: [
          {
            categoryName: category,
            amount: type === "Expense" ? amount : 0,
            subCategories: subcategory
              ? [
                  {
                    subCategoryName: subcategory,
                    amount: type === "Expense" ? amount : 0,
                  },
                ]
              : [],
          },
        ],
        periodId,
        periodType,
        startDate,
        endDate,
      });
    } else {
      if (type === "Income") {
        doc.totalIncome += amount;
      } else {
        doc.totalExpense += amount;
      }

      // Reversals (delete/update) must never drive totals negative
      if (doc.totalIncome < 0) doc.totalIncome = 0;
      if (doc.totalExpense < 0) doc.totalExpense = 0;

      // Checking if the category already exists in categoryBreakdown
      const categoryIndex = doc.categoryBreakdown.findIndex(
        (item) => item.categoryName === category
      );

      if (categoryIndex === -1) {
        // New category for this period: a negative reversal has nothing to
        // subtract from, so don't add a negative row
        if (amount >= 0) {
          doc.categoryBreakdown.push({
            categoryName: category,
            amount: type === "Expense" ? amount : 0,
            subCategories: subcategory
              ? [
                  {
                    subCategoryName: subcategory,
                    amount: type === "Expense" ? amount : 0,
                  },
                ]
              : [],
          });
        }
      } else {
        // If the category exists, update it
        if (type === "Expense") {
          const entry = doc.categoryBreakdown[categoryIndex];
          entry.amount = Math.max(0, entry.amount + amount);
          entry.subCategories = entry.subCategories || [];

          // If subcategory is provided, handle it
          if (subcategory) {
            const subCategoryIndex = entry.subCategories.findIndex(
              (sub) => sub.subCategoryName === subcategory
            );

            if (subCategoryIndex === -1) {
              // If the subcategory doesn't exist, add it
              if (amount >= 0) {
                entry.subCategories.push({
                  subCategoryName: subcategory,
                  amount,
                });
              }
            } else {
              // If the subcategory exists, update it
              entry.subCategories[subCategoryIndex].amount = Math.max(
                0,
                entry.subCategories[subCategoryIndex].amount + amount
              );
            }
          }
        }
      }

      await doc.save();
    }  } catch (err) {
    console.error("Error updating analytics doc:", err);
  }
};

const updateAnalyticsForTransaction = async ({
  userId,
  transaction,
  operation,
  oldTransaction,
}) => {
  const results = {
    operation,
    userId,
    success: true,
    errors: [],
  };

  try {
    const extractDetails = (tx, periodType) => {
      if (!tx.date) {
        throw new Error("Transaction missing 'date' field");
      }

      const period = getPeriodInfo(tx.date, periodType);

      return {
        userId,
        startDate: period.startDate,
        endDate: period.endDate,
        periodId: period.periodId,
        periodType: period.periodType,
        category: tx.category.categoryName,
        subcategory: tx?.category?.subCategory?.subCategoryName ?? null,
        amount: tx.amount,
        type: tx.type.typeName
      };
    };

    if (operation === "create") {
      for (const periodType of ["week", "month", "year"]) {
        const details = extractDetails(transaction, periodType);
        await updateAnalyticsDoc(details);
      }
    } else if (operation === "delete") {
      for (const periodType of ["week", "month", "year"]) {
        const reversed = extractDetails(transaction, periodType);
        reversed.amount *= -1;
        await updateAnalyticsDoc(reversed);
      }
    } else if (operation === "update") {
      for (const periodType of ["week", "month", "year"]) {
        const reverseOld = extractDetails(oldTransaction, periodType);
        reverseOld.amount *= -1;
        await updateAnalyticsDoc(reverseOld);
    
        const updatedNew = extractDetails(transaction, periodType);
        await updateAnalyticsDoc(updatedNew);
      }
    }

    console.log(results);
  } catch (err) {
    results.success = false;
    results.errors.push(err.message || "Unknown error");
    console.error(
      `Error in updateAnalyticsForTransaction for user ${userId} | op: ${operation}`
    );
    console.error(err);
  }

  return results;
};

module.exports = {
  updateAnalyticsForTransaction,
};
