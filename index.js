require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Ejecutamos la conexión a la base de datos
connectDB();

// Middlewares iniciales (IMPORTANTE: poner express.json() antes de las rutas)
app.use(cors());
app.use(express.json());

// ==================== CONFIGURACIÓN DE SWAGGER ====================
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'SafeWork API',
        version: '1.0.0',
        description: 'Documentación oficial de la API SafeWork para reportes industriales.',
        contact: { name: 'Soporte SafeWork', email: 'soporte@safework.com' }
    },
    servers: [
    {
        // Esto detecta automáticamente si estás en Render o en tu PC
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        description: 'Servidor Actual'
    }
],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Copia el token obtenido en /loginUser (sin la palabra Bearer)'
            }
        },
        schemas: {
            Usuario: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    rol: { type: 'string', enum: ['Operador', 'Supervisor', 'Gerente'] },
                    area: { type: 'string' }
                }
            },
            Reporte: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    titulo: { type: 'string' },
                    descripcion: { type: 'string' },
                    areaIncidente: { type: 'string' }, // Sincronizado con el contrato
                    nivelGravedad: { type: 'string', enum: ['Alto', 'Medio', 'Bajo'] },
                    estado: { type: 'string' },
                    reportadoPor: { type: 'string' },
                    fechaCreacion: { type: 'string', format: 'date-time' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    },
    paths: {
        '/api/auth/loginUser': {
            post: {
                tags: ['Autenticación'],
                summary: 'Iniciar sesión',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { 
                        type: 'object', 
                        properties: { email: {type: 'string'}, password: {type: 'string'} } 
                    } } }
                },
                responses: { '200': { description: 'Login exitoso', content: { 'application/json': { schema: { 
                    type: 'object', properties: { token: {type:'string'}, usuario: { $ref: '#/components/schemas/Usuario' } } 
                } } } } }
            }
        },
        '/api/auth/createUser': {
            post: {
                tags: ['Autenticación'],
                summary: 'Registrar nuevo empleado (Solo Gerente)',
                security: [{ bearerAuth: [] }], // Requiere token de Admin
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { 
                        type: 'object',
                        required: ['email', 'password', 'rol', 'area'],
                        properties: {
                            email: { type: 'string', example: 'nuevo.empleado@safework.com' },
                            password: { type: 'string', example: 'Pass123!' },
                            rol: { type: 'string', enum: ['Operador', 'Supervisor', 'Gerente'], example: 'Operador' },
                            area: { type: 'string', example: 'Mantenimiento' }
                        }
                    } } }
                },
                responses: { '201': { description: 'Usuario creado exitosamente' }, '400': { description: 'El usuario ya existe' } }
            }
        },

        // ==================== REPORTES ====================
        '/api/reportes/getAllReports': {
            get: {
                tags: ['Reportes'],
                summary: 'Obtener todos los reportes filtrados por rol',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de reportes según jerarquía',
                        content: { 'application/json': { schema: { 
                            type: 'array', 
                            items: { $ref: '#/components/schemas/Reporte' } 
                        } } }
                    },
                    '401': { description: 'Token no proporcionado o inválido' }
                }
            }
        },
        '/api/reportes/createReporte': {
            post: {
                tags: ['Reportes'],
                summary: 'Crear un nuevo reporte de incidente',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { 
                        type: 'object',
                        properties: {
                            titulo: { type: 'string', example: 'Fuga de aceite' },
                            descripcion: { type: 'string', example: 'Derrame en sector B' },
                            nivelGravedad: { type: 'string', example: 'Alto' },
                            areaIncidente: { type: 'string', example: 'Almacén' }
                        }
                    } } }
                },
                responses: { '201': { description: 'Reporte creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Reporte' } } } } }
            }
        },
        '/api/reportes/{id}/escalar': {
            put: {
                tags: ['Gestión'],
                summary: 'Escalar o actualizar estado (Solo Supervisor/Gerente)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { 
                        type: 'object',
                        properties: { 
                            nuevoEstado: { type: 'string', example: 'En Proceso' },
                            comentariosSupervisor: { type: 'string', example: 'Atendiendo' }
                        }
                    } } }
                },
                responses: { '200': { description: 'Actualizado correctamente' }, '403': { description: 'Permisos insuficientes' } }
            }
        }
    }
};

// --- RUTA DE SWAGGER UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "SafeWork API Docs"
}));

// --- RUTAS DE LA API ---
const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de SafeWork" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor en: http://localhost:${PORT}`);
    console.log(`📚 Swagger en: http://localhost:${PORT}/api-docs`);
});
