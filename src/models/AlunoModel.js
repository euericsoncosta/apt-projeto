// Model: a ÚNICA camada que conversa com o banco de dados.
// Cada método usa o Prisma para fazer uma operação na tabela de alunos.

// Atenção: com ES Modules a extensão .js é obrigatória nos imports do projeto.
import prisma from "../database/prisma.js";

export default class AlunoModel {
  // SELECT * FROM alunos ORDER BY nome ASC
  // Devolve todos os alunos em ordem alfabética.
  // "async" porque o banco demora para responder; quem chama usa "await".
  async listar() {
    return prisma.aluno.findMany({ orderBy: { nome: "asc" } });
  }

  // SELECT * FROM alunos WHERE id = ?
  // Devolve um aluno ou null se não existir. O id precisa ser Number.
  async buscarPorId(id) {
    return prisma.aluno.findUnique({ where: { id } });
  }

  // INSERT INTO alunos ...
  // "dados" é um objeto { nome, email, curso }.
  // Se o e-mail já existir o Prisma lança o erro P2002 (tratado no Controller).
  async criar(dados) {
    return prisma.aluno.create({ data: dados });
  }

  // UPDATE alunos SET ... WHERE id = ?
  // Se o id não existir o Prisma lança o erro P2025 (tratado no Controller).
  async atualizar(id, dados) {
    return prisma.aluno.update({ where: { id }, data: dados });
  }

  // DELETE FROM alunos WHERE id = ?
  // Se o id não existir o Prisma lança o erro P2025 (tratado no Controller).
  async remover(id) {
    return prisma.aluno.delete({ where: { id } });
  }
}
