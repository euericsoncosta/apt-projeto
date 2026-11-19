import "dotenv/config";
import App from "./App.js";

const port = process.env.PORT || 3000;

new App().iniciar(porta);
