// Rotas: ligam cada "método HTTP + caminho" a um método do Controller.

// Router é um mini-aplicativo do Express só para agrupar rotas.
import { Router } from "express";
import AlunoController from "../controllers/AlunoController.js";

// Cria o agrupador de rotas.
const router = Router();

// Cria UMA instância do Controller, compartilhada por todas as rotas.
const controller = new AlunoController();

// No App.js o router é montado com app.use("/alunos", alunoRoutes).
// Por isso o "/" abaixo vira /alunos e o "/:id" vira /alunos/:id.

// Por que (req, res) => controller.index(req, res) e não só controller.index?
// Passando o método solto ele perde a ligação com o objeto e o "this" vira
// undefined. A arrow function chama o método PELO objeto, então o "this" continua certo.

// GET /alunos -> Ler: mostra a lista e o formulário de cadastro (200)
router.get("/", (req, res) => controller.index(req, res));

// POST /alunos -> Criar: cadastra um aluno (302 para /alunos)
router.post("/", (req, res) => controller.criar(req, res));

// GET /alunos/:id/editar -> Ler um aluno: abre o formulário de edição (200)
router.get("/:id/editar", (req, res) => controller.editar(req, res));

// PUT /alunos/:id -> Atualizar: salva as alterações (302 para /alunos)
// O formulário envia POST com ?_method=PUT e o method-override troca o método.
router.put("/:id", (req, res) => controller.atualizar(req, res));

// DELETE /alunos/:id -> Excluir: remove o aluno (302 para /alunos)
// Mesmo esquema do PUT: POST com ?_method=DELETE.
router.delete("/:id", (req, res) => controller.remover(req, res));

// Corrigido: faltava exportar o router, então o App.js importava "undefined".
export default router;
