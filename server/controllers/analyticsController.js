const { AnalyticsModel } = require("../models/analyticsModel");
const { TransactionModel } = require("../models/transactionModel");

const getAnalytics = async (req, res) => {
    try {
      const { userId } = req.body.user; // User ID from request
      const { startDate, endDate } = req.query; // Date range from frontend
  
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "Start and end dates are required." });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Determine date range type
      const sameDay = start.toDateString() === end.toDateString();
      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      const multipleMonths = start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear();
  
      let analyticsData = {};
      let transactions = [];
  
      if (sameDay) {
        // 📌 Case 1: Single Day Query (e.g., "Today")
        transactions = await TransactionModel.find({
          userId,
          date: { $gte: start, $lte: end },
        });
      } else if (!multipleMonths && (end - start) / (1000 * 60 * 60 * 24) <= 10) {
        // 📌 Case 2: Short Range (e.g., Last 7 Days, This Week)
        transactions = await TransactionModel.find({
          userId,
          date: { $gte: start, $lte: end },
        });
      } else if (sameMonth) {
        // 📌 Case 3: Full Month Query (e.g., "This Month")
        analyticsData = await AnalyticsModel.findOne(
          { userId },
          { data: { $elemMatch: { month: start.getMonth() + 1, year: start.getFullYear() } } }
        );
      } else {
        // 📌 Case 4: Multiple Months (e.g., Aug 10 - Nov 5)
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        const startMonth = start.getMonth() + 1; // Convert to 1-based month
        const endMonth = end.getMonth() + 1;
  
        // Get precomputed analytics for full months
        analyticsData = await AnalyticsModel.findOne(
          { userId },
          {
            data: {
              $elemMatch: {
                year: { $gte: startYear, $lte: endYear },
                month: { $gte: startMonth, $lte: endMonth },
              },
            },
          }
        );
  
        // Fetch exact transactions for start & end partial months
        transactions = await TransactionModel.find({
          userId,
          date: { $gte: start, $lte: end },
        });
      }
  
      res.status(200).json({ analyticsData, transactions });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
module.exports = {
    getAnalytics
}