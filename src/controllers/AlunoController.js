import AlunoModel from "../models/AlunoModel.js";

const EMAIL_REPETIDO = "P2002";
const NAO_ENCONTRADO = "P2025";

export default class AlunoController {
  constructor() {
    this.model = new AlunoModel();
  }
  //funcao GET
  async index(req, res) {
    const alunos = await this.model.listar();
    res.render("alunos/index", { alunos });
  }
  //comando POST cadastrar
  async criar(req, res) {
    const { nome, email, curso } = req.body;

    if (!nome || !email || !curso) return "Preencha nome, email e curso";
    if (!email.includes("@")) return "Informe um email válido";
    dados = { nome, email, curso };

    try {
      await this.model.criar(dados);
      res.redirect("alunos");
    } catch (erro) {
      if (erro.code !== EMAIL_REPETIDO) throw erro;
      const alunos = await this.model.listar();

      res.status(409).render("alunos/index", {
        alunos,
        erro: "Já existe um aluno com esse e-mail",
        valores: dados,
      });
      //GET /alus/:id/editar
    }
  }
  async editar(req, res) {
    const { id } = req.params.id;
    const aluno = await this.model.buscarPorId(Number(id));

    if (!aluno) {
      return res
        .status(404)
        .render("erro", { mensagem: "Aluno não cadastrado" });
    }
    res.render("alunos/editar", { aluno });
  }
  // DELETE /alunos/:id
  async remover(req, res) {
    try {
      const { id } = req.params.id;
      await this.model.remover(Number(id));
      res.redirect("/alunos");
    } catch (erro) {
      if (erro.code !== NAO_ENCONTRADO) throw erro;
      res.status(404).render("erro", { mensagem: "Aluno nao cadastrado" });
    }
  }
}
