import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import config from "dotenv"
import { MongoDriver } from '@mikro-orm/mongodb';


config.config()
const connectionString = process.env.MONGO_URI ||
  "mongodb+srv://siteardevs_db_user:UoQv64gdR8losmQB@cluster0.nyv36rq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_DB = process.env.MONGO_DB || "PeluqueriaDB" ;

export const orm = await MikroORM.init({
   entities: ["dist/**/*.entity.js"],
entitiesTs: ["src/**/*.entity.ts"],
    dbName: MONGO_DB,
    clientUrl: connectionString,
    highlighter: new MongoHighlighter(),
    debug: true,
    allowGlobalContext: true,
    driver: MongoDriver,
    
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}

