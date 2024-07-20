import { Router } from "express";
import { getCliente, cadastrarCliente, buscarCliente, editarCliente, deletarCliente } from "../controllers/livrosController.js";

const router = Router();

router.get("/", getCliente);
router.post("/criar", cadastrarCliente);
router.get("/:id", buscarCliente);
router.put("/editar/:id", editarCliente);
router.delete("/remover/:id", deletarCliente);

export default router;