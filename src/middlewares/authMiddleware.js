const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Sacamos el token del header "Authorization"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "No se proporcionó un token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos los datos del usuario (id, rol) en la petición
        next(); // ¡Todo bien! Pasa a la siguiente función (el controlador)
    } catch (error) {
        return res.status(403).json({ error: "Forbidden", message: "Token inválido o expirado." });
    }
};

module.exports = { verificarToken };