// test-mongo.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    console.log(process.env.MONGO_URI)
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("✅ Conexión exitosa a MongoDB!");
    await client.close();
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
}

testConnection();
