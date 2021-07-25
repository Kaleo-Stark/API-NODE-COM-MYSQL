const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: 'apiNode'
});

connection.connect((err) => {
    if(err) return console.log(err) ; 
    console.log('Conectou!') ;

    createTable(connection);

    //addRows(connection); // ... Chama a função que adiciona dados ao banco de dados.
});

function createTable(conn){
    fs.readFile('./scriptsSQL/tableClientes.sql', 'utf8', (err, query)=>{
        if(err) {
            console.log('Erro ao ler script!');
        } else {
            conn.query(query, (error, results, fields) => {
                (error) ? console.log(error): console.log('Criou a tabela!');
            });
        }
    });
}

function addRows(conn){
    const values = [
        ['teste1', '12345678901'],
        ['teste2', '12345678902'],
        ['teste3', '12345678903']
    ];

    fs.readFile('./scriptsSQL/insertClient.sql', 'utf8', (err, query)=>{
        if(err) {
            console.log('Erro ao ler script!');
        } else {
            conn.query(query, [values], (error, results, fields) => {
                (error) ? console.log(error): 
                console.log('Adicionou registros!'),
                conn.end() // ... Fecha a conexão;
            });
        }
    });
}