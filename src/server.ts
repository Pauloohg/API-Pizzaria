import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);


if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      console.log("Banco de dados conectado!");
      
      app.listen(PORT, () => {
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Erro ao conectar com o banco de dados:", error);
    });
}

export default app;