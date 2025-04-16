const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },
  subCategoryName: { type: String },
  // income: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
}, { _id: false, versionKey: false });

const categoryBreakdownSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  categoryName: { type: String, required: true },
  // income: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  subCategories: [subCategorySchema],
}, { _id: false, versionKey: false });

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  periodType: { type: String, enum: ["week", "month", "year"], required: true },
  periodId: { type: String, required: true }, // e.g., "2025-W15", "2025-04", "2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 },
  categoryBreakdown: [categoryBreakdownSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

analyticsSchema.index({ userId: 1, periodType: 1, periodId: 1 }, { unique: true });

const AnalyticsModel = mongoose.model("analytic", analyticsSchema);

module.exports = {
  AnalyticsModel,
};
