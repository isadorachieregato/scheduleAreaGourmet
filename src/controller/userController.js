const express = require('express');
const router = express.Router();
const connect = require("../db/connect");

class UserController {
  static async postUser(req, res) {
    const { name, apartment, block, telephone, email, password } = req.body;

    // Verificação de campos obrigatórios
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    if (!apartment) return res.status(400).json({ error: "Apartamento é obrigatório" });
    if (!block) return res.status(400).json({ error: "Bloco é obrigatório" });
    if (!telephone) return res.status(400).json({ error: "Telefone é obrigatório" });
    if (!email) return res.status(400).json({ error: "Email é obrigatório" });
    if (!password) return res.status(400).json({ error: "Senha é obrigatória" }); 

    try {
      // Consulta SQL utilizando variáveis para prevenir SQL injection
      const emailCheckQuery = `SELECT * FROM user WHERE email = ?`;
      const telephoneCheckQuery = `SELECT * FROM user WHERE telephone = ?`;

      // Verifica se o e-mail já está cadastrado
      connect.query(emailCheckQuery, [email], function (err, emailResults) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }

        if (emailResults.length > 0) {
          return res.status(409).json({ error: "Já existe um usuário com esse e-mail cadastrado" });
        }

        // Verifica se o telefone já está cadastrado
        connect.query(telephoneCheckQuery, [telephone], function (err, telephoneResults) {
          if (err) {
            console.error("Erro ao executar a consulta:", err);
            return res.status(500).json({ error: "Erro ao executar a consulta" });
          }

          if (telephoneResults.length > 0) {
            return res.status(409).json({ error: "Já existe um usuário com esse telefone cadastrado" });
          }

          // Se não houver conflitos, insira o novo usuário no banco de dados
          const insertQuery = `
            INSERT INTO user (name, apartment, block, telephone, email, password)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          connect.query(insertQuery, [name, apartment, block, telephone, email, password], function (err, results) {
            if (err) {
              console.error("Erro ao criar usuário:", err);
              return res.status(500).json({ error: "Erro ao criar usuário" });
            }

            return res.status(201).json({ message: "Usuário criado com sucesso", userId: results.insertId });
          });
        });
      });
    } catch (error) {
      console.log("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }

  static async putUser(req, res) {
    const { name, apartment, block, telephone, email, password } = req.body;
  
    // Verificação de campos obrigatórios
    if (!name) return res.status(400).json({ error: "O campo nome é obrigatório" });
    if (!apartment) return res.status(400).json({ error: "O campo apartamento é obrigatório" });
    if (!block) return res.status(400).json({ error: "O campo bloco é obrigatório" });
    if (!telephone) return res.status(400).json({ error: "O campo telefone é obrigatório" });
    if (!email) return res.status(400).json({ error: "O campo email é obrigatório" });
    if (!password) return res.status(400).json({ error: "O campo senha é obrigatório" });
  
    try {
      const checkQuery = `SELECT * FROM user WHERE email =?`;
      connect.query(checkQuery, [email], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
  
        // Atualiza o usuário
        const updateQuery = `
          UPDATE user
          SET name = ?, apartment = ?, block = ?, telephone = ?, password = ?
          WHERE email = ?
        `;
        connect.query(updateQuery, [name, apartment, block, telephone, password, email], function (err, results) {
          if (err) {
            console.error("Erro ao atualizar o usuário:", err);
            return res.status(500).json({ error: "Erro ao atualizar o usuário" });
          }
  
          return res.status(200).json({ message: "Usuário atualizado com sucesso" });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Ocorreu um erro ao atualizar o usuário" });
    }
  }

  static async deleteUser(req, res) {
    const { name } = req.body;
  
    try {
      // Verifica se o usuário existe pelo nome
      const checkQuery = `SELECT * FROM user WHERE name = ?`;
      connect.query(checkQuery, [name], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
  
        // Deleta o usuário
        const deleteQuery = `DELETE FROM user WHERE name = ?`;
        connect.query(deleteQuery, [name], function (err, results) {
          if (err) {
            console.error("Erro ao deletar o usuário:", err);
            return res.status(500).json({ error: "Erro ao deletar o usuário" });
          }
  
          return res.status(200).json({ message: "Usuário deletado com sucesso" });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Ocorreu um erro ao deletar o usuário" });
    }
  }

  static async getUser(req, res) {
    const { email } = req.body;
  
    // Verificação de campos obrigatórios
    if (!email) return res.status(400).json({ error: "O email do usuário é obrigatório" });
  
    try {
      // Consulta SQL utilizando variáveis para prevenir SQL injection
      const getQuery = `SELECT * FROM user WHERE email =?`;
  
      connect.query(getQuery, [email], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length > 0) {
          const userInfo = results[0];
          return res.status(200).json(userInfo);
        } else {
          return res.status(404).json({ error: "Nenhum usuário encontrado para esse email" });
        }
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }

  static async Login(req, res) {
    const { email, password } = req.query;
  
    // Verificação de campos obrigatórios
    if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" });
  
    try {
      // Consulta SQL utilizando variáveis para prevenir SQL injection
      const getQuery = `SELECT * FROM user WHERE email =? AND password =?`;
  
      connect.query(getQuery, [email, password], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length > 0) {
          return res.status(200).json({ message: "Usuário autenticado com sucesso!", user: results[0] });
        } else {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }

  static async getLogin(req, res) {
    const { email, password } = req.body;
  
    // Verificação de campos obrigatórios
    if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" });
  
    try {
      // Consulta SQL utilizando variáveis para prevenir SQL injection
      const getQuery = `SELECT * FROM user WHERE email =? AND password =?`;
  
      connect.query(getQuery, [email, password], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length > 0) {
          return res.status(200).json({ results });
        } else {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }
}

module.exports = UserController;
