const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  data: [
    {
      month: { type: Number, required: true }, // 1 (Jan) - 12 (Dec)
      year: { type: Number, required: true },
      totalIncome: { type: Number, default: 0 },
      totalExpense: { type: Number, default: 0 },
      categoryBreakdown: [
        {
          categoryId: mongoose.Schema.Types.ObjectId,
          categoryName: String,
          totalSpent: Number,
          subCategories: [
            {
              subCategoryId: mongoose.Schema.Types.ObjectId,
              subCategoryName: String,
              amount: Number,
            },
          ],
        },
      ],
    },
  ],
});

const AnalyticsModel = mongoose.model("analytic", analyticsSchema);

module.exports = {
  AnalyticsModel,
};
