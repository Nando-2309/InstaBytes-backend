import express from "express"; // Importa o framework Express.js
import multer from "multer"; // Importa o multer para upload de arquivos
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost, deletarPost } from "../controllers/postsController.js";
import { ObjectId } from "mongodb"; // Importa ObjectId para validação
import cors from "cors"; // Habilita o uso de CORS (Cross-Origin Resource Sharing)

const corsOptions = {
    origin: "http://localhost:8000", // Define quais origens podem acessar a API
    optionsSuccessStatus: 200 // Configuração de status de resposta bem-sucedida
};

// Configuração para salvar arquivos enviados no diretório correto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define o destino dos arquivos
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Define o nome do arquivo
    }
});

const upload = multer({ dest: "./uploads", storage }); // Configura multer para upload de arquivos

// Middleware para validar o ID
const validarId = (req, res, next) => {
    const { id } = req.params; // Pega o ID da URL

    if (!ObjectId.isValid(id)) { // Verifica se o ID é válido
        return res.status(400).json({ message: 'ID inválido' }); // Responde com erro 400 se for inválido
    }

    next(); // Se for válido, continua para o próximo middleware/controlador
};

const routes = (app) => {
    app.use(express.json()); // Habilita o uso de JSON no corpo das requisições
    app.use(cors(corsOptions)); // Habilita o CORS com as opções configuradas

    // Define as rotas da aplicação
    app.get("/posts", listarPosts); // Rota para listar posts
    app.post("/posts", postarNovoPost); // Rota para criar um novo post
    app.post("/upload", upload.single("imagem"), uploadImagem); // Rota para upload de imagens
    app.put("/upload/:id", atualizarNovoPost); // Rota para atualizar um post

    // Aplica o middleware `validarId` antes da rota DELETE
    app.delete("/posts/:id", validarId, deletarPost); // Rota para deletar um post
};

export default routes; // Exporta a configuração de rotas
