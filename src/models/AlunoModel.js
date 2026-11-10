import prisma from '../database/prisma.js';

export default class AlunoModel{
    async listar(){
        return prisma.aluno.findMany({orderBy: {nome: 'asc'}})
    }

    async buscarPorId(id){
        return prisma.aluno.findUnique({where:{id}})
    }

    async criar(dados){
        return prisma.aluno.create({data: dados})
    }

    async atualizar(id, dados){
        return prisma.aluno.update({where:{id}, data: dados})
    }

    async remover(id){
        return prisma.aluno.delete({where:{id}})
    }
}