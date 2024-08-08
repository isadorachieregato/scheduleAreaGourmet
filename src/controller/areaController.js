const connect = require("../db/connect");

//Criação da classe AreaController onde estarão todos os métodos HTTP
module.exports = class AreaController {
  static async postArea(req, res) {
    const { capacity, norms, appliances, name } = req.body;
    // Verificação de campos obrigatórios
    if (!capacity)
      return res.status(400).json({ error: "O campo capacidade é obrigatório" });
    if (!norms)
      return res.status(400).json({ error: "O campo normas é obrigatório" });
    if (!appliances)
      return res.status(400).json({ error: "O campo utensílios é obrigatório" });
    if (!name)
      return res.status(400).json({ error: "O campo nome é obrigatório" });

    try {
      const overlapQuery = `
        SELECT * FROM area
        WHERE name =? 
      `;

connect.query(overlapQuery, [name], function (err, results) {
  if (err) {
    console.error("Erro ao executar a consulta:", err);
    return res.status(500).json({ error: "Erro ao executar a consulta" });
  }

  if (results.length > 0) {
    return res
     .status(400)
     .json({ error: "Já existe uma área com esse nome" });
  }


        // Se não houver conflitos, insira a nova area no banco de dados
        const insertQuery = `
          INSERT INTO area (capacity, norms, appliances, name)
          VALUES (?, ?, ?, ?)
        `;

        connect.query(insertQuery, [ capacity, norms, appliances, name ], function (err, results) {
          if (err) {
            console.error("Erro ao inserir a area:", err);
            return res.status(500).json({ error: "Erro ao inserir a area" });
          }

          return res.status(201).json({ 
            message: "Area criada com sucesso",
            areaId: results.insertId,
          });
        });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ocorreu um erro ao cadastrar a área gourmet." });
    }
  }

  //Atualização do objeto do escopo
  static async putArea(req, res) {
    const { capacity, norms, appliances, name } = req.body;
  
    // Verificação de campos obrigatórios
    if (!capacity)
      return res.status(400).json({ error: "O campo capacidade é obrigatório" });
    if (!norms)
      return res.status(400).json({ error: "O campo normas é obrigatório" });
    if (!appliances)
      return res.status(400).json({ error: "O campo utensílios é obrigatório" });
    if (!name)
      return res.status(400).json({ error: "O campo nome é obrigatório" });
  
    try {
      // Verifica se a área existe pelo nome
      const checkQuery = `SELECT * FROM area WHERE name = ?`;
      connect.query(checkQuery, [name], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Área não encontrada" });
        }
  
        // Query para atualizar a área
        const updateQuery = `
          UPDATE area
          SET capacity  = ?, norms = ?, appliances = ?
          WHERE name = ?
        `;
        connect.query(updateQuery, [capacity, norms, appliances, name], function (err, results) {
          if (err) {
            console.error("Erro ao atualizar a área:", err);
            return res.status(500).json({ error: "Erro ao atualizar a área" });
          }
  
          return res.status(200).json({ message: "Área atualizada com sucesso" });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Ocorreu um erro ao atualizar a área" });
    }
  }
  
  static async deleteArea(req, res) {
    const { name } = req.body;
  
    try {
      // Verifica se a área existe pelo nome
      const checkQuery = `SELECT * FROM area WHERE name = ?`;
      connect.query(checkQuery, [name], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Área não encontrada" });
       }
  
        // Deleta a área caso a query de verificação encontre a área
        const deleteQuery = `DELETE FROM area WHERE name = ?`;
        connect.query(deleteQuery, [name], function (err, results) {
          if (err) {
            console.error("Erro ao deletar a área:", err);
            return res.status(500).json({ error: "Erro ao deletar a área" });
          }
  
          return res.status(200).json({ message: "Área deletada com sucesso" });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Ocorreu um erro ao deletar a área" });
    }
  }

  //Aqui será obtida a área que tiver o nome enviado via req.body
  static async getAreaByName(req, res) {
    const { name } = req.body;

    try {
        const getQuery = `SELECT * FROM Area WHERE name = ?`;

        connect.query(getQuery, [name], function (err, results) {
            if (err) {
                console.error("Erro ao executar a consulta:", err);
                return res.status(500).json({ error: "Erro ao executar a consulta" });
            }

            if (results.length > 0) {
                const areaInfo = results[0];
                return res.status(200).json(areaInfo);
            } else {
                return res.status(404).json({ error: "Nenhum registro encontrado para esse nome" });
            }
        });
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
}

  

  static async getAreas(req, res) {
    try {
        // Consulta SQL para obter todas as áreas
        const getQuery = `SELECT * FROM Area`;

        connect.query(getQuery, function (err, results) {
            if (err) {
                console.error("Erro ao executar a consulta:", err);
                return res.status(500).json({ error: "Erro ao executar a consulta" });
            }

            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(404).json({ error: "Nenhuma área encontrada" });
            }
        });
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }

};
