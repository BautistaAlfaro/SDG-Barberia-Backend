"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSchema = exports.orm = void 0;
const core_1 = require("@mikro-orm/core");
const mongo_highlighter_1 = require("@mikro-orm/mongo-highlighter");
const dotenv_1 = require("dotenv");
const mongodb_1 = require("@mikro-orm/mongodb");
const user_entity_js_1 = require("../entities/user.entity.js");
dotenv_1.default.config();
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant";
const MONGO_DB = process.env.MONGO_DB || "restaurant";
exports.orm = await core_1.MikroORM.init({
    entities: [user_entity_js_1.User],
    dbName: MONGO_DB,
    clientUrl: connectionString,
    highlighter: new mongo_highlighter_1.MongoHighlighter(),
    debug: true,
    allowGlobalContext: true,
    driver: mongodb_1.MongoDriver,
});
const syncSchema = async () => {
    const generator = exports.orm.getSchemaGenerator();
    await generator.updateSchema();
    console.log("✅ Esquema sincronizado con MongoDB");
};
exports.syncSchema = syncSchema;
