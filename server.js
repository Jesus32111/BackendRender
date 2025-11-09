import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

// Funciones para leer/escribir db.json
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Inicializar db.json si no existe
if (!fs.existsSync(DB_PATH)) {
  writeDB({ users: [] });
}

// Endpoints

// Obtener todos los usuarios
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Agregar usuario
app.post("/users", (req, res) => {
  const db = readDB();
  const user = req.body;
  db.users.push(user);
  writeDB(db);
  res.status(201).json(user);
});

// Actualizar usuario por id
app.put("/users/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.users.findIndex(u => u.id == id);
  if (index === -1) return res.status(404).json({ error: "Usuario no encontrado" });

  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);
  res.json(db.users[index]);
});

// Eliminar usuario por id
app.delete("/users/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.users = db.users.filter(u => u.id != id);
  writeDB(db);
  res.json({ message: "Usuario eliminado" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
