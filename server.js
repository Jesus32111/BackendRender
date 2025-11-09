import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ logger: true });

// Habilitar CORS
server.use(cors());

// Middlewares estándar de json-server
server.use(middlewares);

// Rutas del router
server.use(router);

// Render usa una variable de entorno PORT
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`✅ JSON Server corriendo en puerto ${PORT}`);
});
