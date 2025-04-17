const mongoose = require("mongoose");
const { AnalyticsModel } = require("../models/analyticsModel");
const { TransactionModel } = require("../models/transactionModel");
const moment = require("moment-timezone"); // ⏲️ Use moment-timezone for IST

const getAnalytics = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const { startDate, endDate, periodType, periodId } = req.query;

    if (!periodType) {
      return res.status(400).json({ error: "periodType is required." });
    }

    let start, end;
    const zone = "Asia/Kolkata"; // 📍 Set to IST timezone

    // 🧠 Determine start and end based on periodType
    switch (periodType) {
      case "today":
        start = moment.tz(zone).startOf("day").toDate();
        end = moment.tz(zone).endOf("day").toDate();
        break;
      case "yesterday":
        start = moment.tz(zone).subtract(1, "day").startOf("day").toDate();
        end = moment.tz(zone).subtract(1, "day").endOf("day").toDate();
        break;
      case "lastWeek":
        start = moment.tz(zone).subtract(1, "week").startOf("isoWeek").toDate();
        end = moment.tz(zone).subtract(1, "week").endOf("isoWeek").toDate();
        break;
      case "week":
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      case "lastMonth":
        start = moment.tz(zone).subtract(1, "month").startOf("month").toDate();
        end = moment.tz(zone).subtract(1, "month").endOf("month").toDate();
        break;
      case "month":
        // start = new Date(startDate);
        // end = new Date(endDate);
        if (!periodId) {
          return res.status(400).json({ error: "periodId is required for month" });
        }
        break;
      case "lastYear":
        start = moment.tz(zone).subtract(1, "year").startOf("year").toDate();
        end = moment.tz(zone).subtract(1, "year").endOf("year").toDate();
        break;
      case "year":
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      case "custom":
        if (!startDate || !endDate) {
          return res
            .status(400)
            .json({ error: "startDate and endDate required for custom range" });
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      default:
        return res.status(400).json({ error: "Invalid periodType." });
    }

    let analyticsData = [];
    let granularity = periodType;

    if (periodType === "today" || periodType === "yesterday") {
      const data = await TransactionModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalIncome: {
                    $sum: {
                      $cond: [
                        { $eq: ["$type.typeName", "Income"] },
                        "$amount",
                        0,
                      ],
                    },
                  },
                  totalExpense: {
                    $sum: {
                      $cond: [
                        { $eq: ["$type.typeName", "Expense"] },
                        "$amount",
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            categories: [
              {
                $match: {
                  "type.typeName": "Expense",
                },
              },
              {
                $group: {
                  _id: "$category.categoryName",
                  totalAmount: { $sum: "$amount" },
                },
              },
            ],
          },
        },
        {
          $project: {
            totalIncome: { $arrayElemAt: ["$summary.totalIncome", 0] },
            totalExpense: { $arrayElemAt: ["$summary.totalExpense", 0] },
            categoryBreakdown: "$categories",
          },
        },
      ]);

      return res.status(200).json({
        analyticsData: data[0] || {},
        startDate: start,
        endDate: end,
        granularity: "day",
      });
    } else if (periodType === "lastWeek" || periodType === "week") {
      const weekId = getWeekId(start); // e.g., "2025-W14"

      const analyticsDoc = await AnalyticsModel.findOne({
        userObjectId,
        periodType: "week",
        periodId: weekId,
      });

      console.log("weekId", weekId);

      return res.status(200).json({
        analyticsData: analyticsDoc || {},
        startDate: start,
        endDate: end,
        granularity: "week",
      });
    } else if (periodType === "month"
      //  || periodType === "lastMonth"
      ) {
        
      analyticsData = await AnalyticsModel.find({
        userId,
        periodType: "month",
        periodId: periodId,
        // { $gte: getMonthId(start), $lte: getMonthId(end) },
      });
      // console.log(analyticsData, periodId, periodType, userObjectId);
    } else if (periodType === "year"
      //  || periodType === "lastYear"
      ) {
      analyticsData = await AnalyticsModel.find({
        userObjectId,
        periodType: "year",
        periodId: periodId,
      });
    } else if (periodType === "custom") {
      // 🧠 Use dynamic granularity for custom range if needed later
      analyticsData = []; // Or aggregate manually if needed
    }

    return res.status(200).json({
      analyticsData,
      startDate: start,
      endDate: end,
      granularity,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAnalytics = async (req, res) => { // temp
  try {
    const analytics = await AnalyticsModel.find();
    res.status(200).json({ analytics });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong while getting analytics", error });
  }
}

// Helper to get week ID like "2025-W15"
const getWeekId = (date) => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
};

// Helper for month ID like "2025-04"
const getMonthId = (date) => {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
};

module.exports = {
  getAnalytics,
  getAllAnalytics
};
