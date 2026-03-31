const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

// Definimos el endpoint exacto del contrato
// Como esta ruta la vamos a agrupar bajo "/api/auth" en el index, aquí solo ponemos "/loginUser"
router.post("/loginUser", loginUser);

module.exports = router;
