import { express } from "express";
import { engine } from "express-handlebars";
import methodOverride from "method-override";

import alunoRoutes from "./routes/alunoRoutes.js";

export default class App {
  contructor() {
    this.app = express();
    this.configurarViews();
    this.configurarMiddlewares();
    this.configurarRotas();
  }
  configurarViews() {
    this.app.engine(
      ".hbs",
      engine({
        extname: ".hbs",
        helpers: {
          formatarData: (data) => new Date(data).toLocaleDateString("pt-BR"),
        },
      }),
    );
    this.app.set("view engine", "hbs");
    this.app.set("views", "./src/views");
  }
  configurarMiddlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(methodOverride("_method"));
    this.app.use(express.static("public"));
  }
  configurarRotas() {
    this.app.use("/alunos", alunoRoutes);
  }

  iniciar(porta) {
    this.app.listen(porta, () => {
      console.log(`Servidor rodando em http://localhost:${porta}`);
    });
  }
}
