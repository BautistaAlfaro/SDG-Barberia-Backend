import { orm } from "../config/orm.js";
import { Service } from "../entities/service.entity.js";
import { validateService } from "../entities/service.schema.js";
const em = orm.em;
// 🟢 CREAR SERVICIO
export async function add(req, res) {
    try {
        const validationResult = validateService(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: validationResult.error?.errors ?? [],
            });
        }
        const service = em.create(Service, req.body);
        await em.flush();
        res.status(201).json({
            message: "Servicio creado correctamente",
            data: service,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// 🔍 OBTENER TODOS LOS SERVICIOS
export async function findAll(req, res) {
    try {
        const services = await em.find(Service, {});
        res.status(200).json({ message: "Servicios encontrados", data: services });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// 🔍 OBTENER UN SERVICIO POR ID
export async function findOne(req, res) {
    try {
        const service = await em.findOne(Service, { id: req.params.id });
        if (!service)
            return res.status(404).json({ message: "Servicio no encontrado" });
        res.status(200).json({ message: "Servicio encontrado", data: service });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// ✏️ ACTUALIZAR SERVICIO
export async function update(req, res) {
    try {
        const service = await em.findOne(Service, { id: req.params.id });
        if (!service)
            return res.status(404).json({ message: "Servicio no encontrado" });
        em.assign(service, req.body);
        await em.flush();
        res.status(200).json({ message: "Servicio actualizado", data: service });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// 🗑️ ELIMINAR SERVICIO
export async function remove(req, res) {
    try {
        const service = await em.findOne(Service, { id: req.params.id });
        if (!service)
            return res.status(404).json({ message: "Servicio no encontrado" });
        await em.removeAndFlush(service);
        res.status(200).json({ message: "Servicio eliminado", data: service });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=service.controller.js.map