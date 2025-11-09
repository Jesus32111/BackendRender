import jsonServer from "json-server";
import cors from "cors";
import fs from "fs";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;
const DB_FILE = "db.json";

// ================================
// Middleware
// ================================
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// ================================
// Verificar base de datos
// ================================
if (!fs.existsSync(DB_FILE)) {
  console.error("❌ No se encontró el archivo db.json");
  process.exit(1);
} else {
  console.log(`📁 Base de datos encontrada: ${DB_FILE}`);
}

// ================================
// Logs de solicitudes
// ================================
server.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.url}`);
  next();
});

// ================================
// Manejador de errores
// ================================
server.use((err, req, res, next) => {
  console.error("💥 Error en el servidor:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ================================
// Iniciar servidor
// ================================
server.use(router);
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
