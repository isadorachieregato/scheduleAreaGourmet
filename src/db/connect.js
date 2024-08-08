const mysql = require('mysql2')


const pool = mysql.createPool({
    connectionLimit:10,
    host: 'localhost', // Mude para seu host
    user: 'root', // Mude para seu user
    password: 'senai@604', // Mude para sua senha
    database: 'viver_bem' // Mude para sua tabela
})

module.exports = pool