const mysql = require('mysql')

function connect() 
{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'priyanka',
        password: 'priyanka',
        database: 'jewellery',
        port: 3306
    })

    connection.connect()
    return connection
}

module.exports = {
    connect: connect
}