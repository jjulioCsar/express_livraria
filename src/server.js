import 'dotenv/config';
import express from "express";

// Importação dos modelos e criação das tabelas
import "./models/livroModel.js";
import "./models/funcionarioModel.js";
import "./models/clienteModel.js"

// Importação das ROTAS
import livroRoutes from "./routes/livroRoutes.js";
import funcionarioRoutes from "./routes/funcionarioRoutes.js"
import clienteRoutes from "./routes/clienteRoutes.js"

const PORT = process.env.PORT || 3333; // Adicione um valor padrão para a porta

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Utilização das rotas
// http://localhost:3333/livros
app.use('/livros', livroRoutes);

app.use('/funcionarios', funcionarioRoutes )

app.use('/clientes', clienteRoutes)

app.get('/', (req, res) => {
    res.send('Olá, Mundo!');
});

app.listen(PORT, () => {
    console.log("Servidor on PORT " + PORT);
});
