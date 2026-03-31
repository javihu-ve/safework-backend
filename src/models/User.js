const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Evita correos duplicados
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
      enum: ["Operador", "Supervisor", "Gerente"], // Solo acepta estos 3 roles
      default: "Operador",
    },
    area: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente fechaCreacion y fechaActualizacion
  },
);

module.exports = mongoose.model("User", userSchema);
