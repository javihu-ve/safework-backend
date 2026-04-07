const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    areaIncidente: { type: String, required: true }, // Antes era ubicacion o area
    nivelGravedad: { 
        type: String, 
        required: true,
        enum: ['Alto', 'Medio', 'Bajo'] // Según el contrato [source: 10]
    },
    estado: { 
        type: String, 
        default: 'Pendiente de Revisión' // Valor inicial del contrato [source: 10]
    },
    reportadoPor: { type: String }, // Aquí guardaremos el ID del usuario después
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reporte', reportSchema);