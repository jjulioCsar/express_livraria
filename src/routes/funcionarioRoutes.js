import { Router } from "express";
import { getFuncionarios, cadastrarFuncionario, buscarFuncionario, editarFuncionario, deletarFuncionario } from "../controllers/funcionariosController.js";

const router = Router();

router.get("/", getFuncionarios);
router.post("/create", cadastrarFuncionario);
router.get("/:id", buscarFuncionario);
router.put("/editar/:id", editarFuncionario);
router.delete("/remover/:id", deletarFuncionario);

export default router;
