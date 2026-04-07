const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
// Para src/routes/authRoutes.js
const { loginUser, createUser, getUsers } = require("../controllers/authController");


router.post("/loginUser", loginUser);
router.post("/createUser", createUser);
router.get("/getAllUsers",verificarToken, getUsers);

module.exports = router;
