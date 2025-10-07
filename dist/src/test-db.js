"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orm_js_1 = require("./config/orm.js");
async function testDB() {
    try {
        await orm_js_1.orm.connect();
        console.log("✅ Conexión exitosa a MongoDB");
        await (0, orm_js_1.syncSchema)();
        console.log("📦 Esquema sincronizado correctamente");
        await orm_js_1.orm.close(true);
    }
    catch (err) {
        console.error("❌ Error al conectar a la DB:", err);
    }
}
testDB();
