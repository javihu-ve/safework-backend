const mongoose = require('mongoose');

const reportShema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    areaIncidente: {
        type: String,
        required: true
    },
    nivelGravedad: {
        type: String,
        enum: ['baja', 'media', 'alta'],
        default: 'media'
    },
    estado: {
        type: String,
        default: 'abierto'
    },
    reportadoPor: {
        type: String,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Reporte', reportShema);