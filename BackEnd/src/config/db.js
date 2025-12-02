const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "petshop";

if (!uri) {
  throw new Error("Falta MONGODB_URI en el archivo .env");
}

let client;
let db;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  db = client.db(dbName);
  console.log("Conectado a MongoDB Atlas, DB:", dbName);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("La base de datos no está conectada.");
  }
  return db;
}

module.exports = { connectDB, getDB, ObjectId };
