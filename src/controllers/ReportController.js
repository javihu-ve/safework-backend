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

// Endpoint 3.1: Escalar / Actualizar Estado
exports.escalarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado, comentariosSupervisor } = req.body;

        // 1. Verificar jerarquía: Solo Supervisor o Gerente pueden escalar
        if (req.user.rol === 'Operador') {
            return res.status(403).json({ 
                error: "Forbidden", 
                message: "No tienes la jerarquía necesaria para escalar este incidente." 
            });
        }

        // 2. Buscar y actualizar el reporte
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            id,
            { 
                estado: nuevoEstado,
                $push: { historialComentarios: { 
                    autor: req.user.id, 
                    comentario: comentariosSupervisor,
                    fecha: new Date() 
                }}
            },
            { new: true } // Para que devuelva el objeto ya cambiado
        );

        if (!reporteActualizado) {
            return res.status(404).json({ error: "Not Found", message: "Reporte no encontrado." });
        }

        res.status(200).json({
            _id: reporteActualizado._id,
            estado: reporteActualizado.estado,
            ultimaActualizacion: new Date(),
            mensaje: "El incidente ha sido actualizado correctamente."
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};