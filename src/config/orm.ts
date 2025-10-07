import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import dotenv from "dotenv";
import { MongoDriver } from "@mikro-orm/mongodb";
import { User } from "../entities/user.entity.js";

dotenv.config();

const connectionString =
  process.env.MONGO_URI ||
  "mongodb+srv://siteardevs_db_user:UoQv64gdR8losmQB@cluster0.nyv36rq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const MONGO_DB = process.env.MONGO_DB || "PeluqueriaDB";

// 👇 Lo envolvemos en una función para evitar el error del "top-level await"
export async function initORM() {
  const orm = await MikroORM.init({
    entities: [User],
    dbName: MONGO_DB,
    clientUrl: connectionString,
    highlighter: new MongoHighlighter(),
    debug: true,
    allowGlobalContext: true,
    driver: MongoDriver,
  });

  console.log("✅ Conectado correctamente a MongoDB");
  return orm;
}

// 👇 También adaptamos la función de sincronización
export async function syncSchema() {
  const orm = await initORM();
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  console.log("✅ Esquema sincronizado con MongoDB");
  await orm.close();
}
