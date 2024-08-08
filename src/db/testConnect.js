const connect = require("../db/connect");

module.exports = function testConnect(){
    try{
        const query= `SELECT 'Conexão bem sucedida' AS Mensagem`;
connect.query (query, function(err){
    if(err){
        console.log("Erro na conexão:"+err);
        return;
    }
    console.log("Conexão realizada no MySQL")
})
    }catch(error){
        console.error("Erro ao executar uma consulta:",error)
    }
}
