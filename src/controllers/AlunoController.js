// Controller: recebe a requisição, chama o Model e decide a resposta.

import AlunoModel from "../models/AlunoModel.js";

// Códigos de erro do Prisma que vamos tratar:
// P2002 = violação de campo @unique (e-mail repetido)
const EMAIL_REPETIDO = "P2002";
// P2025 = registro não encontrado (update/delete de id que não existe)
const NAO_ENCONTRADO = "P2025";

export default class AlunoController {
  // Roda uma vez, quando fazemos new AlunoController().
  // Guarda o Model em this.model para usar nos outros métodos.
  constructor() {
    this.model = new AlunoModel();
  }

  // GET /alunos -> mostra a lista e o formulário de cadastro (200)
  async index(req, res) {
    // Pede a lista ao Model (que busca no banco).
    const alunos = await this.model.listar();
    // Entrega a lista à View, que monta o HTML.
    res.render("alunos/index", { alunos });
  }

  // POST /alunos -> cadastra um aluno novo
  async criar(req, res) {
    // req.body traz os dados do formulário; lerFormulario limpa os campos.
    const dados = this.lerFormulario(req.body);
    // Valida: devolve uma mensagem de erro ou null se estiver tudo certo.
    const erro = this.validar(dados);

    if (erro) {
      const alunos = await this.model.listar();
      // 400 Bad Request: campo vazio ou e-mail sem @.
      // "valores" devolve o que foi digitado para o usuário não perder tudo.
      return res.status(400).render("alunos/index", { alunos, erro, valores: dados });
    }

    try {
      await this.model.criar(dados);
      // Post/Redirect/Get: responde 302 e o navegador faz um GET em /alunos.
      // Corrigido: antes era "alunos" (sem a barra), que é um caminho relativo
      // e podia virar /alunos/alunos.
      res.redirect("/alunos");
    } catch (e) {
      // Qualquer erro que não seja e-mail repetido é inesperado: relança
      // para o tratador de erros do App responder 500.
      if (e.code !== EMAIL_REPETIDO) throw e;
      const alunos = await this.model.listar();
      // 409 Conflict: já existe aluno com esse e-mail.
      res.status(409).render("alunos/index", {
        alunos,
        erro: "Já existe um aluno com esse e-mail.",
        valores: dados,
      });
    }
  }

  // GET /alunos/:id/editar -> mostra o formulário de edição (200)
  async editar(req, res) {
    // Corrigido: req.params.id já é o valor (texto). O código antigo fazia
    // "const { id } = req.params.id", que desestrutura uma string e dá undefined.
    // req.params.id vem como texto ('7'), por isso converte com Number().
    const aluno = await this.model.buscarPorId(Number(req.params.id));

    // Aluno não existe: 404 Not Found.
    if (!aluno) {
      return res.status(404).render("erro", { mensagem: "Aluno não encontrado." });
    }

    res.render("alunos/editar", { aluno });
  }

  // PUT /alunos/:id -> salva as alterações
  async atualizar(req, res) {
    // Corrigido: antes era "const { id } = Number(...)", que também dava undefined.
    const id = Number(req.params.id);
    const dados = this.lerFormulario(req.body);
    const erro = this.validar(dados);

    if (erro) {
      // 400: reabre o formulário de edição com o erro e os dados digitados.
      return res.status(400).render("alunos/editar", { aluno: { id, ...dados }, erro });
    }

    try {
      await this.model.atualizar(id, dados);
      // 302 de volta para a lista.
      res.redirect("/alunos");
    } catch (e) {
      // O aluno não existe mais: 404.
      if (e.code === NAO_ENCONTRADO) {
        return res.status(404).render("erro", { mensagem: "Aluno não encontrado." });
      }
      // E-mail já usado por outro aluno: 409.
      if (e.code === EMAIL_REPETIDO) {
        return res.status(409).render("alunos/editar", {
          aluno: { id, ...dados },
          erro: "Já existe um aluno com esse e-mail.",
        });
      }
      // Corrigido: o "throw" estava DENTRO do if do e-mail, depois de um
      // return (nunca executava). Erros desconhecidos eram engolidos e a
      // requisição ficava sem resposta. Agora ele fica no fim do catch.
      throw e;
    }
  }

  // DELETE /alunos/:id -> exclui o aluno
  async remover(req, res) {
    try {
      // Corrigido: mesmo erro do "const { id } = req.params.id".
      await this.model.remover(Number(req.params.id));
      res.redirect("/alunos");
    } catch (e) {
      // Só tratamos "não encontrado"; o resto vai para o tratador de erros.
      if (e.code !== NAO_ENCONTRADO) throw e;
      res.status(404).render("erro", { mensagem: "Aluno não encontrado." });
    }
  }

  // Pega só os campos que interessam e remove espaços nas pontas.
  // O "?? ''" evita erro se o campo não vier no formulário.
  // O e-mail vai para minúsculas para "A@x.com" e "a@x.com" não virarem dois cadastros.
  lerFormulario(body) {
    return {
      nome: (body.nome ?? "").trim(),
      email: (body.email ?? "").trim().toLowerCase(),
      curso: (body.curso ?? "").trim(),
    };
  }

  // Regras de validação. Devolve a mensagem de erro ou null se estiver tudo certo.
  // (O PDF chama este método de "validar"; o nome foi alinhado com ele.)
  validar({ nome, email, curso }) {
    if (!nome || !email || !curso) return "Preencha nome, e-mail e curso.";
    if (!email.includes("@")) return "Informe um e-mail válido.";
    return null;
  }
}
