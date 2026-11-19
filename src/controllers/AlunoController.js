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
    const dados = this.lerFormulario(req.body);
    const erro = this.validarCampos(dados);
    if (erro) {
      const alunos = await this.model.listar();
      return res
        .status(400)
        .render("alunos/index", { alunos, erro, valores: dados });
    }

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

  async atualizar(req, res) {
    const { id } = Number(req.params.id);
    const dados = this.lerFormulario(req.body);
    const erro = this.validarCampos(dados);
    if (erro) {
      return res
        .status(400)
        .render("alunos/editar", { aluno: { id, ...dados }, erro });
    }
    try {
      await this.model.atualizar(id, dados);
      res.redirect("/alunos");
    } catch (erro) {
      if (erro.code === NAO_ENCONTRADO) {
        return res
          .status(404)
          .render("erro", { mensagem: "Aluno não encontrado!" });
      }
      if (erro.code === EMAIL_REPETIDO) {
        return res.status(409).render("alunos/editar", {
          aluno: { id, ...dados },
          erro: "Já existe um aluno com esse e-mail",
        });
        throw erro;
      }
    }
  }

  validarCampos({ nome, email, curso }) {
    if (!nome || !email || !curso) return "Preencha nome, email e curso";
    if (!email.includes("@")) return "Informe um email válido";
    return null;
  }
  // Pega só os campos que interessam e remove espaços nas pontas
  lerFormulario(body) {
    return {
      nome: (body.nome ?? "").trim(),
      email: (body.email ?? "").trim().toLowerCase(),
      curso: (body.curso ?? "").trim(),
    };
  }
}
