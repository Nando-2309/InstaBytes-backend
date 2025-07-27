import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece a conexão com o banco de dados usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO.
// O 'await' garante que a conexão seja estabelecida antes de continuar a execução.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

// Função assíncrona para obter todos os posts do banco de dados
export  async function getTodosPosts(){
     // Obtém o banco de dados 'imersao-instabytes' da conexão
     const db = conexao.db("imersao-instabytes");
     // Obtém a coleção 'posts' do banco de dados
     const colecao = db.collection("posts")
     // Retorna um array com todos os documentos da coleção
     return colecao.find().toArray()
 
}

export async function criarPost(novoPost) {

     const db = conexao.db("imersao-instabytes");
     const colecao = db.collection("posts");
     return colecao.insertOne(novoPost)
     
}

export async function atualizarPost(id, novoPost) {

     const db = conexao.db("imersao-instabytes");
     const colecao = db.collection("posts");
     const objID = ObjectId.createFromHexString(id)
     return colecao.updateOne({_id:new ObjectId(objID)}, {$set:novoPost})
     
}

export async function excluirPost(id) {
     const db = conexao.db("imersao-instabytes"); // Seleciona o banco de dados 'imersao-instabytes'
     const colecao = db.collection("posts"); // Obtém a coleção 'posts' dentro do banco
 
     try {
         const objID = new ObjectId(id); // Converte o ID recebido em um ObjectId válido do MongoDB
         return colecao.deleteOne({ _id: objID }); // Realiza a exclusão do documento com o ID correspondente
     } catch (error) {
         console.error("Erro na exclusão do banco:", error); // Loga qualquer erro ocorrido no processo de exclusão
         throw error; // Lança o erro para que o controlador saiba que ocorreu um problema
     }
 }
 

