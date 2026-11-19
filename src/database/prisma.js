// Conexão com o banco de dados.

// PrismaClient é a classe gerada pelo "prisma migrate dev" / "prisma generate".
// É ela que sabe consultar as tabelas definidas no schema.prisma.
import { PrismaClient } from "@prisma/client";

// Criamos UMA única instância e a compartilhamos por todo o projeto.
// Assim não abrimos várias conexões com o banco sem necessidade.
const prisma = new PrismaClient();

// Todo arquivo que precisar do banco importa esta mesma conexão.
export default prisma;
