import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "../../data/habits.json");

let store = null;

// Almacenamiento local en JSON (funciona sin instalar nada).
async function createFileStore() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  let cache = [];
  try {
    cache = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    cache = [];
  }
  const save = () => fs.writeFile(FILE, JSON.stringify(cache, null, 2));

  return {
    name: "archivo JSON local",
    async findAll() {
      return [...cache];
    },
    async create(data) {
      const item = { _id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() };
      cache.push(item);
      await save();
      return item;
    },
    async remove(id) {
      const before = cache.length;
      cache = cache.filter((h) => h._id !== id);
      await save();
      return cache.length < before;
    },
  };
}

// Almacenamiento en MongoDB (si defines MONGODB_URI).
async function createMongoStore(uri) {
  const mongoose = (await import("mongoose")).default;
  const { default: Habit } = await import("../models/Habit.js");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  const clean = (doc) => {
    const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return { ...o, _id: String(o._id) };
  };

  return {
    name: "MongoDB",
    async findAll() {
      return (await Habit.find().lean()).map(clean);
    },
    async create(data) {
      return clean(await Habit.create(data));
    },
    async remove(id) {
      try {
        return !!(await Habit.findByIdAndDelete(id));
      } catch {
        return false;
      }
    },
  };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      store = await createMongoStore(uri);
      return store;
    } catch (err) {
      console.warn("No se pudo conectar a MongoDB:", err.message);
      console.warn("Se usará el archivo JSON local.");
    }
  }
  store = await createFileStore();
  return store;
}

export const getStore = () => store;
