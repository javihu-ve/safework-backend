const express = require("express");
const router = express.Router();
// Para src/routes/authRoutes.js
const { loginUser, createUser } = require("../controllers/authController");


router.post("/loginUser", loginUser);
router.post("/createUser", createUser);

module.exports = router;
