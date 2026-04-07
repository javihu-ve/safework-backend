const express = require("express");
const router = express.Router();
// Para src/routes/authRoutes.js
const { loginUser, createUser } = require("../controllers/authController");
const { createReporte, getReportes } = require("../controllers/ReportController");

router.post("/loginUser", loginUser);
router.post("/createUser", createUser);
router.post("/createReportes", createReporte); // Uso directo
router.get("/getAllReports", getReportes);     // Uso directo
module.exports = router;
