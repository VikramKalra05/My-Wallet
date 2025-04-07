const { AnalyticsModel } = require("../models/analyticsModel");

const updateAnalytics = async (
  userId,
  date,
  amount,
  type,
  category,
  subCategory
) => {
  console.log("Updating analytics for:", {
    userId,
    date,
    amount,
    type,
    category,
    subCategory,
  });

  const month = date.getMonth() + 1; // Get month (1-12)
  const year = date.getFullYear();

  // Find if analytics exists for this user
  let analytics = await AnalyticsModel.findOne({ userId });

  if (!analytics) {
    // Create a new analytics record if it doesn't exist
    analytics = new AnalyticsModel({ userId, data: [] });
  }

  // Find month-year entry inside `data` array
  let monthDataIndex = analytics.data.findIndex(
    (d) => d.month === month && d.year === year
  );

  if (monthDataIndex === -1) {
    // Month-year entry does not exist, create a new one
    analytics.data.push({
      month,
      year,
      totalIncome: 0,
      totalExpense: 0,
      categoryBreakdown: [],
    });
    monthDataIndex = analytics.data.length - 1;
  }

  // Reference the correct monthData
  let monthData = analytics.data[monthDataIndex];

  // Update total income/expense
  if (type === "Income") {
    monthData.totalIncome += amount;
  } else if (type === "Expense") {
    monthData.totalExpense += amount;
  }

  // Find category in `categoryBreakdown`
  let categoryIndex = monthData.categoryBreakdown.findIndex(
    (c) => c.categoryId?.toString() === category
  );

  if (categoryIndex === -1) {
    // Create a new category if it doesn't exist
    monthData.categoryBreakdown.push({
      categoryId: category,
      categoryName: "Unknown", // Fetch actual name if needed
      totalSpent: 0,
      subCategories: [],
    });
    categoryIndex = monthData.categoryBreakdown.length - 1;
  }

  let categoryData = monthData.categoryBreakdown[categoryIndex];
  categoryData.totalSpent += amount;

  // If there's a subcategory, update it
  if (subCategory) {
    let subCategoryIndex = categoryData.subCategories.findIndex(
      (sc) => sc.subCategoryId?.toString() === subCategory
    );

    if (subCategoryIndex === -1) {
      categoryData.subCategories.push({
        subCategoryId: subCategory,
        subCategoryName: "Unknown",
        amount: 0,
      });
      subCategoryIndex = categoryData.subCategories.length - 1;
    }

    categoryData.subCategories[subCategoryIndex].amount += amount;
  }

  await analytics.save();

  console.log("Analytics updated successfully.", analytics);
};

module.exports = {
  updateAnalytics,
};
