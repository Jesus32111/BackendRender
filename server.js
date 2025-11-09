import { createRequire } from "module";
import cors from "cors";

// Esto permite usar require dentro de un proyecto ESM
const require = createRequire(import.meta.url);
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ logger: true });

server.use(cors());
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`✅ Servidor JSON corriendo en puerto ${PORT}`);
});
