// src/scripts/seedGerente.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Importamos modelo

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a la BD para sembrar datos...");

    // 1. Verificamos si ya existe un gerente para no duplicarlo
    const gerenteExistente = await User.findOne({
      email: "admin@safework.com",
    });
    if (gerenteExistente) {
      console.log("El Super Gerente ya existe en la base de datos.");
      process.exit(0);
    }

    // 2. Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin123utr", salt);

    // 3. Creamos al usuario con el rol más alto
    const superGerente = new User({
      email: "admin@safework.com",
      password: hashedPassword,
      rol: "Gerente",
      area: "Dirección General",
    });

    await superGerente.save();
    console.log("Super Gerente creado exitosamente");
    console.log("Email: admin@safework.com");
    console.log("Password: Admin123utr");

    process.exit(0);
  } catch (error) {
    console.error("Error al sembrar el usuario:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
