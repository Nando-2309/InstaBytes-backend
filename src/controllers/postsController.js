import { getTodosPosts, criarPost, atualizarPost, excluirPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados utilizando a função getTodosPosts do modelo
    const posts = await getTodosPosts();
    // Envia uma resposta HTTP com status 200 (OK) e os posts em formato JSON
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post enviados no corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função criarPost do modelo para inserir o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Envia uma resposta HTTP com status 200 (OK) e o post criado em formato JSON
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra algum erro, loga a mensagem de erro no console e envia uma resposta HTTP com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo a URL da imagem e a descrição
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Chama a função criarPost do modelo para inserir o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Constrói o novo nome do arquivo da imagem, utilizando o ID do post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo da imagem para o novo nome, movendo-o para a pasta "uploads"
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia uma resposta HTTP com status 200 (OK) e o post criado em formato JSON
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra algum erro, loga a mensagem de erro no console e envia uma resposta HTTP com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }

   
}
export async function deletarPost(req, res) {
    try {
        const postId = req.params.id; // Obtém o ID do post passado como parâmetro na URL
        console.log("ID recebido para exclusão:", postId); // Loga o ID recebido para monitoramento

        const resultado = await excluirPost(postId); // Chama a função para excluir o post no banco de dados
        console.log("Resultado da exclusão:", resultado); // Loga o resultado retornado pelo banco

        if (resultado.deletedCount === 0) { // Verifica se algum documento foi excluído
            return res.status(404).json({ message: 'Post não encontrado' }); // Se não, retorna um erro 404
        }

        res.json({ message: 'Post excluído com sucesso!' }); // Retorna mensagem de sucesso em formato JSON
    } catch (error) {
        console.error("Erro ao excluir post:", error); // Loga qualquer erro que possa ter ocorrido
        res.status(500).json({ message: 'Erro ao excluir post' }); // Retorna um erro 500 (interno do servidor)
    }
}
