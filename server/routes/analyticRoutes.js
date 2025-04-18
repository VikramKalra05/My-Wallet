const express = require("express");
const { getAnalytics, getAllAnalytics, getLast6MonthsAnalytics } = require("../controllers/analyticsController");
const { auth } = require("../middleware/auth.middleware");

const analyticsRouter = express.Router();

analyticsRouter.get("/user", auth, getAnalytics);
analyticsRouter.get("/all", auth, getAllAnalytics);
analyticsRouter.get("/last6Months", auth, getLast6MonthsAnalytics);

module.exports = analyticsRouter;