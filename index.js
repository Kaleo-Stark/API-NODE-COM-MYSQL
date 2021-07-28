// ###########( CONFIGURAÇÕES )###########
const express = require('express') ; // ... Importa a biblioteca Express, responsavel pelos recursos WEBService.
const   app   =     express()      ; // ... Cria um estância do express;
const  mysql  =  require('mysql')  ; // ... Importa a biblioteca do MySQL.
const router  =  express.Router()  ; // ... Estância uma nova rota express;
//const cors  =  require('cors') ; // ... Responsável por controlar o acesso a API.

//app.use   (     cors()     ) ; // ....... Configura a API para aceitar requisições de qualquer origem com o cors.
app.use   ( express.json() ) ; // ......... Configura a API para trabalhar com JSON.
app.listen(      3333      ) ; // ......... Faz a API escutar a porta '3000' do servidor da API.
// ####################################### 


// ###############( ROTAS )###############

router.get('/', (req, res) => { // ...................... Define uma rota raiz;
    return res.json( { message: 'Funcionando' } ); // ... Retorna uma mensagem ao acessar essa rota com o metodo get.
});

router.get('/clientes', (req, res) => { // ............ Define uma rota GET para 'clientes', onde será solicitado todos os dados.
    execSQLQuery('SELECT * FROM Clientes', res); // ... Chama a função que irá executar a query e retornara os valores.
}); 

router.get('/clientes/:id?', (req, res) => { // ............................... Define uma rota GET para 'clientes', onde será solicitado apenas um cliente pelo id.
    let filter = ''; // ....................................................... String que irá receber a query que fará o filtro.

    if(req.params.id) filter = ' WHERE ID = ' + parseInt(req.params.id); // ... Se tiver o id, cria a string com a query para fazer o filtro.

    execSQLQuery('SELECT * FROM Clientes ' + filter, res); // ................. Chama a função que irá executar a query e retornara o valor solicitado, caso ele exista.
});



app.use('/', router);

// #######################################


function execSQLQuery(sqlQry, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'kaleostark',
        password: '',
        database: 'apiNode'
    });

    connection.query(sqlQry, (error, results, fields) => {
        if(error){ res.json(error); }
        else{ res.json(results); }

        connection.end();
    });
}