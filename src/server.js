// Ponto de entrada da aplicação: é este arquivo que o "npm run dev" executa.

// Carrega o arquivo .env para dentro de process.env.
// Precisa vir ANTES de tudo, porque o Prisma lê DATABASE_URL de lá.
import "dotenv/config";

// Importa a classe que monta o servidor (views, middlewares e rotas).
import App from "./App.js";

// Usa a porta definida no .env (PORT) ou, se não existir, a 3000.
// (Erro corrigido: antes a variável se chamava "port" e era usada como "porta".)
const porta = process.env.PORT || 3000;

// Cria o servidor e o coloca para escutar na porta escolhida.
new App().iniciar(porta);
