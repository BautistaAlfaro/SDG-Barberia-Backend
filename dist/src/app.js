import "reflect-metadata";
import { orm, syncSchema } from "./config/orm.js";
import cors from "cors";
import { RequestContext } from "@mikro-orm/core";
import express from "express";
import { userRouter } from "./routes/user.routes.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
await syncSchema();
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Rutas públicas 
app.use("/api/users/login", userRouter);
app.use("/api/users/register", userRouter);
// Rutas protegidas 
app.use("/api/users", userRouter);
app.use((req, res) => {
    res.status(404).send({ message: "Resource not found" });
});
app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
});
//# sourceMappingURL=app.js.map