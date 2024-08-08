const connect = require("../db/connect");

module.exports = class BookingController {
  static async createBooking(req, res) {
    const { Date_init, Date_end, FK_ID_area, FK_email } = req.body;

    // Verificação de campos obrigatórios
    if (!Date_init)
      return res.status(400).json({ error: "A Data de Início é obrigatória" });
    if (!Date_end)
      return res.status(400).json({ error: "A Data Final é obrigatória" });
    if (!FK_ID_area)
      return res.status(400).json({ error: "O ID da área é obrigatório" });
    if (!FK_email)
      return res.status(400).json({ error: "O E-mail do usuário é obrigatório" });

    try {
      // Consulta para verificar conflitos de reserva no mesmo dia
      const overlapQuery = `
        SELECT * FROM Booking
        WHERE FK_ID_area = ? AND (
          (? BETWEEN Date_init AND Date_end) OR
          (? BETWEEN Date_init AND Date_end) OR
          (Date_init BETWEEN ? AND ?) OR
          (Date_end BETWEEN ? AND ?)
        )
      `;

      connect.query(overlapQuery, [FK_ID_area, Date_init, Date_end, Date_init, Date_end, Date_init, Date_end], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "Sala ocupada para os mesmos dias e horários" });
        }

        // Se não houver conflito de datas com a área, a reserva será criada
        const insertQuery = `
          INSERT INTO Booking (FK_email, FK_ID_area, Date_init, Date_end)
          VALUES (?, ?, ?, ?)
        `;

        connect.query(insertQuery, [FK_email, FK_ID_area, Date_init, Date_end], function (err, results) {
          if (err) {
            console.error("Erro ao inserir a reserva:", err);
            return res.status(500).json({ error: "Erro ao inserir a reserva" });
          }

          return res.status(201).json({
            message: "Reserva criada com sucesso",
            bookingId: results.insertId,
          });
        });
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }

  static async getBooking(req, res) {
    const { email } = req.params; // Desestrutura o parâmetro email da URL

    try {
        // Consulta SQL utilizando "?" para prevenir SQL injection
        const getQuery = `SELECT * FROM Booking WHERE FK_email = ?`;

        connect.query(getQuery, [email], function (err, results) {
            if (err) {
                console.error("Erro ao executar a consulta:", err);
                return res.status(500).json({ error: "Erro ao executar a consulta" });
            }

            if (results.length > 0) {
                return res.status(200).json(results); // Retorna todos os resultados
            } else {
                return res.status(404).json({ error: "Nenhum registro encontrado para esse email" });
            }
        });
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
}

  static async getAllBookings(req, res) {
    try {
      // Consulta SQL para obter todas as reservas
      const getQuery = `SELECT * FROM Booking`;

      connect.query(getQuery, function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }

        if (results.length > 0) {
          return res.status(200).json(results);
        } else {
          return res.status(404).json({ error: "Nenhuma reserva encontrada" });
        }
      });
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }
  static async putBooking(req, res) {
    const { ID_booking, Date_init } = req.body;

    // Verificação de campos obrigatórios
    if (!ID_booking)
      return res.status(400).json({ error: "O ID da reserva é obrigatório" });
    if (!Date_init)
      return res.status(400).json({ error: "O campo Data é obrigatório" });

    try {
      // Verifica se a reserva existe pelo ID
      const checkQuery = `SELECT * FROM Booking WHERE ID_booking = ?`;
      connect.query(checkQuery, [ID_booking], function (err, results) {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
        //If para coletar os resultados, caso eles sejam iguais a zero, significa que não existe aquela reserva, assim não podendo atualizá-la 
        if (results.length === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }

        // Query para atualizar a reserva caso não existam conflitos
        const updateQuery = `
        UPDATE Booking
        SET Date_init = ?, Date_end = ?
        WHERE ID_booking = ?
      `;
        connect.query(updateQuery, [Date_init, Date_init, ID_booking], function (err, results) {
          if (err) {
            console.error("Erro ao atualizar a reserva:", err);
            return res.status(500).json({ error: "Erro ao atualizar a reserva" });
          }

          return res.status(200).json({ message: "Reserva atualizada com sucesso" }); //Confirmação da atualiação da reserva
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Ocorreu um erro ao atualizar a reserva" });
    }
  }

  static async deleteBooking(req, res) {
    const { ID_booking } = req.params;

    try {
      //Query para consulta se existe uma reserva com o ID especificado
      const checkQuery = 'SELECT * FROM Booking WHERE ID_booking = ?';
      connect.query(checkQuery, [ID_booking], (err, results) => {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro ao executar a consulta" });
        }
        //If para verificar a existencia da reserva
        if (results.length === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        //Query para deletar a reserva por meio do ID da mesma
        const deleteQuery = 'DELETE FROM Booking WHERE ID_booking = ?';
        connect.query(deleteQuery, [ID_booking], (err, results) => {
          if (err) {
            console.error("Erro ao deletar a reserva:", err);
            return res.status(500).json({ error: "Erro ao deletar a reserva" });
          }
          //Confirmção da deleção da reserva
          return res.status(200).json({ message: "Reserva deletada com sucesso" });
        });
      });
    } catch (error) {
      console.error("Ocorreu um erro ao deletar a reserva:", error);
      return res.status(500).json({ error: "Ocorreu um erro ao deletar a reserva" });
    }
  }



};
