require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Ejecutamos la conexión a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS DE LA API ---
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes); // Esto le pone el prefijo a todas las rutas de auth

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de SafeWork" });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de SafeWork corriendo en http://localhost:${PORT}`);
});
