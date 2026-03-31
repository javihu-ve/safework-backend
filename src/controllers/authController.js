const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Correo o contraseña incorrectos.",
      });
    }

    // 2. Comparar la contraseña que enviaron con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Correo o contraseña incorrectos.",
      });
    }

    // 3. Crear el Token JWT (La credencial de acceso)
    const token = jwt.sign(
      { id: user._id, rol: user.rol }, // Metemos el ID y el Rol adentro del token
      process.env.JWT_SECRET, // Firmamos con el secreto del .env
      { expiresIn: "24h" }, // Expira en 1 día
    );

    // 4. Mandar la respuesta tal cual dice el contrato
    res.status(200).json({
      token,
      usuario: {
        id: user._id,
        email: user.email,
        rol: user.rol,
        area: user.area,
      },
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error en el servidor.",
    });
  }
};

module.exports = { loginUser };
