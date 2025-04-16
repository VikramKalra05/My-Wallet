const express = require("express");
const { getAnalytics, getAllAnalytics } = require("../controllers/analyticsController");
const { auth } = require("../middleware/auth.middleware");

const analyticsRouter = express.Router();

analyticsRouter.get("/user", auth, getAnalytics);
analyticsRouter.get("/all", auth, getAllAnalytics);

module.exports = analyticsRouter;