import { Router } from "express";
import AlunoController from "../controllers/AlunoController.js";

const router = Router();
const controller = new AlunoController();

router.get("/", (req, res) => controller.index(req, res));
router.post("/", (req, res) => controller.criar(req, res));
router.get("/:id/editar", (req, res) => controller.editar(req, res));
router.put("/:id", (req, res) => controller.atualizar(req, res));
router.delete("/:id", (req, res) => controller.remover(req, res));
