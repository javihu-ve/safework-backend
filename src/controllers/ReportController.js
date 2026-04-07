const Reporte = require('../models/Report');

exports.createReporte = async (req, res) => {
    try {
        // Extraemos los nombres exactos que vienen en el JSON del contrato [source: 10]
        const { titulo, descripcion, nivelGravedad, areaIncidente } = req.body;

        const nuevoReporte = new Reporte({
            titulo,
            descripcion,
            nivelGravedad,
            areaIncidente,
            // El 'estado' se pone solo por el default del modelo
        });

        await nuevoReporte.save();
        
        // Respuesta exitosa (201 Created)
        res.status(201).json(nuevoReporte);
        
    } catch (error) {
        console.error("Error al crear reporte:", error);
        res.status(400).json({ 
            error: "Bad Request", 
            message: "No se pudo crear el reporte. Revisa los campos obligatorios." 
        });
    }
};

exports.getReportes = async (req, res) => {
    try {
        const reportes = await Reporte.find();
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};