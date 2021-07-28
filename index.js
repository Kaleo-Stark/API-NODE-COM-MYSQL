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

router.delete('/clientes/:id', (req, res) => { // ......................................... Define uma rota DELETE para 'clientes', onde será solicitado que seja deletado o cliente com o id expecífico.
    execSQLQuery('DELETE FROM Clientes WHERE ID = ' + parseInt(req.params.id), res); // ... Chama a função que irá executar a query e deletar o cliente com o id.
});

router.post('/clientes', (req, res) => { // ........... Define uma rota POST, onde será passado dados para criar o cadastro de um novo cliente.
    let dados = { 
        nome: req.body.nome.substring(0,150),
        cpf : req.body.cpf.substring(0,11)
    }; // ............................................. Variável que recebe dados enviado no corpo da requisição. 

    let query = `INSERT INTO Clientes (nome, CPF) 
    VALUES ( '${dados.nome}', '${dados.cpf}' )`; // ... Variável que monta a query para inserção.

    execSQLQuery(query, res); // ...................... Chama a função que irá executar a query e salvará o novo cliente.
});

/*OBS:
    Para fazer updates podemos utilizar os verbos PUT ou PATCH. 
    O Protocolo diz que devemos utilizar PUT se pretendemos passar
    todos os os parâmetros da entidade que está sendo atualizada,
    mas aqui jamais será atualizado o ID, então esta sendo utilizado
    o PATCH.
*/

router.patch('/clientes/:id', (req, res) => { // ...................................................... Define uma rota PATCH, que receberá no corpo da requisição os dados a serem alterados.
    const id = parseInt(req.params.id); // ............................................................ Recebe e tenta converter para int o ID.
    const nome = req.body.nome.substring(0,150); // ................................................... Recebe e verifica a string do corpo da requisição referente ao nome.
    const cpf = req.body.cpf.substring(0,11); // ...................................................... Recebe e verifica a string do corpo da requisição referente ao CPF.

    execSQLQuery(`UPDATE Clientes SET Nome = '${nome}', CPF = '${cpf}' WHERE ID = ${id};`, res); // ... Chama a função que irá executar a query e irá alterar os dados no banco de dados.
});

app.use('/', router); // .............................. Faz a aplicação definir as rotas.

// #######################################


function execSQLQuery(sqlQry, res) { // ......................... Função que cria a conexão com o banco de ddados e recebe a query a ser executa.
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'kaleostark',
        password: '',
        database: 'apiNode'
    }); // ...................................................... String para conexão com o banco de dados.

    connection.query(sqlQry, (error, results, fields) => { // ... Tenta fazer a conexão com o banco de dados, passando a string de conexão.
        if(error){ res.json(error); } // ........................ Se houve erro na conexão, ele retorna o erro.
        else{ res.json(results); } // ........................... Se houve sucesso ele retorna os dados referente ao sucesso.

        connection.end(); // .................................... Finaliza a conexão.
    });
}