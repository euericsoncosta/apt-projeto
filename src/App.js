// Classe App: monta o servidor (views, middlewares e rotas).

// Corrigido: o Express é export DEFAULT, então o import não leva chaves.
// (antes: import { express } -> dava erro)
import express from "express";
// engine é a função que ensina o Express a renderizar arquivos Handlebars.
import { engine } from "express-handlebars";
// method-override permite enviar PUT e DELETE a partir de formulários HTML.
import methodOverride from "method-override";

import alunoRoutes from "./routes/alunoRoutes.js";

export default class App {
  // Corrigido: o nome era "contructor" (faltava o s), então nunca rodava
  // e this.app ficava undefined.
  constructor() {
    // Cria a aplicação Express.
    this.app = express();
    // A ORDEM importa: views, depois middlewares, depois rotas.
    this.configurarViews();
    this.configurarMiddlewares();
    this.configurarRotas();
  }

  // Configura o Handlebars, que monta o HTML no servidor.
  configurarViews() {
    // Corrigido: o nome do engine é "hbs" (sem ponto). Com ".hbs" o
    // Express não achava o motor de templates.
    this.app.engine(
      "hbs",
      engine({
        // Extensão dos arquivos de view.
        extname: ".hbs",
        // Helpers são funções que podem ser chamadas dentro das views.
        helpers: {
          // Uso na view: {{formatarData criadoEm}} -> 09/11/2026
          formatarData: (data) => new Date(data).toLocaleDateString("pt-BR"),
        },
      }),
    );
    // Diz ao Express qual engine usar quando res.render() for chamado.
    this.app.set("view engine", "hbs");
    // Pasta onde ficam as views (e o layouts/main.hbs).
    this.app.set("views", "./src/views");
  }

  // Middlewares: funções que rodam em TODA requisição, antes das rotas.
  configurarMiddlewares() {
    // Lê os dados enviados por formulários e coloca em req.body.
    // Sem isso, req.body fica undefined.
    this.app.use(express.urlencoded({ extended: false }));

    // Formulário HTML só envia GET e POST.
    // Um POST com ?_method=PUT ou ?_method=DELETE vira PUT ou DELETE aqui.
    // Precisa vir ANTES das rotas, senão o método não é trocado a tempo.
    this.app.use(methodOverride("_method"));

    // Mostra no terminal cada requisição que chega (útil para testar os 4 métodos).
    this.app.use((req, res, next) => {
      // req.originalMethod guarda o método que o navegador realmente enviou.
      // Se for diferente de req.method, o method-override fez a troca.
      const veioComo =
        req.originalMethod !== req.method
          ? ` (chegou como ${req.originalMethod})`
          : "";
      console.log(`${req.method} ${req.path}${veioComo}`);
      // next() passa a requisição para o próximo middleware/rota.
      next();
    });

    // Serve arquivos estáticos da pasta public (ex.: /css/estilo.css).
    this.app.use(express.static("public"));
  }

  // Liga os caminhos às rotas.
  configurarRotas() {
    // A raiz redireciona para a lista de alunos.
    this.app.get("/", (req, res) => res.redirect("/alunos"));

    // Monta o router com o prefixo /alunos: o "/:id" dele vira /alunos/:id.
    this.app.use("/alunos", alunoRoutes);

    // Nenhuma rota respondeu: página não encontrada (404).
    // Usa a view "erro" (será criada na próxima aula).
    this.app.use((req, res) => {
      res.status(404).render("erro", { mensagem: "Página não encontrada." });
    });

    // Tratador de erros do Express: tem QUATRO parâmetros (erro, req, res, next).
    // No Express 5, um erro dentro de um método async chega aqui sozinho.
    this.app.use((erro, req, res, next) => {
      console.error(erro);
      res.status(500).render("erro", { mensagem: "Erro interno no servidor." });
    });
  }

  // Coloca o servidor para escutar na porta informada.
  iniciar(porta) {
    this.app.listen(porta, () => {
      console.log(`Servidor rodando em http://localhost:${porta}`);
    });
  }
}
