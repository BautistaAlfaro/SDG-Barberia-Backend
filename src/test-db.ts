import { initORM } from "./config/orm.js";

async function testConnection() {
  const orm = await initORM();
  await orm.close();
}

testConnection().catch(console.error);
