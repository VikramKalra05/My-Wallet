const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const { auth } = require("../middleware/auth.middleware");

const analyticsRouter = express.Router();

analyticsRouter.get("/user", auth, getAnalytics);

module.exports = analyticsRouter;