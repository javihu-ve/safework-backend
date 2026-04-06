const Reporte = require('../models/Report');

exports.getReportes = async (res) => {
    try {
        const reportes = await Reporte.find();//no usar find by id porque queremos traer todos
        res.json(reportes);//el proceso se va a cerrar hasta que obtenga una respuesta o hasta que se acabe el limite de tiempo
    } catch {
        res.status(500).json({ error: "Error: Get Reports", message: error });
    }
}

exports.createReporte = async (req, res) => {
    try {
        const { titulo, descripcion, areaIncidente, estado } = req.body;
        //const titulo = req.body.titulo;
        //Logic
        let prioridad = "media";
        if (descripcion.toLowerCase().includes('fuego') || descripcion.toLowerCase().includes('incendio')) {
            prioridad = "alta";
        }

        const nuevoReporte = new Reporte({
            titulo,
            descripcion,
            areaIncidente,
            prioridad,
            estado
        });

        await nuevoReporte.save();
        res.status(201).json(nuevoReporte);//201 successfull
    } catch (error) {
        res.status(400).json({ error: "Error: Create reports", message: error });//400 es para bad request
    }
}