const express = require("express");
const router = express.Router();
const { createReport } = require("../controllers/ReportController");

router.post("/createReportes", createReport.createReporte);
router.get("/getAllReports", createReport.getReportes);

module.exports = router;
