import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

// Funciones para leer/escribir db.json
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    writeDB({ users: [] });
    return { users: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Inicializar db.json si no existe
if (!fs.existsSync(DB_PATH)) {
  writeDB({ users: [] });
}

// Endpoints

// Obtener usuarios (Con soporte para filtros de Login)
app.get("/users", (req, res) => {
  const db = readDB();
  let users = db.users;

  // Filtrar si vienen parámetros (ej: para login o verificar email)
  if (req.query.email) {
    users = users.filter(u => u.email === req.query.email);
  }
  if (req.query.password) {
    users = users.filter(u => u.password === req.query.password);
  }

  res.json(users);
});

// Obtener usuario por ID
app.get("/users/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const user = db.users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(user);
});

// Agregar usuario (Con generación de ID)
app.post("/users", (req, res) => {
  const db = readDB();
  const user = req.body;
  
  // Asignar un ID único (usamos timestamp como solución simple)
  user.id = Date.now().toString();
  
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

// Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Backend escuchando en http://localhost:${PORT}`));