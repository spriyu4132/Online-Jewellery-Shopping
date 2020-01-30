const db = require('./db')
const utils=require('./utils')
const express = require('express')


const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    const statement = `select * from admin`
    connection.query(statement, (error, data) => {
        connection.end()
        const users = []
        for (let index = 0; index < data.length; index++) {
            const admin = data[index]
            users.push({
                admin_id: admin['admin_id'],
                admin_name: admin['admin_name'],
                password: admin['password'],
                role: admin['role']
            })
        }
        response.send(utils.createResult(error, users))
    })
})

router.post('/', (request, response) => {
    const {admin_id,admin_name,password} = request.body
    //const encryptedPassword = '' + cryptoJs.MD5(password)
    const connection = db.connect()
    const statement = `insert into admin values (${admin_id},'${admin_name}','${password}')`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.post('/login', (request, response) => {
    const {admin_name, password} = request.body
    //const encryptedPassword = '' + cryptoJs.MD5(password)
    const connection = db.connect()
    const statement = `select * from admin where admin_name = '${admin_name}' and password = '${password}'`
    connection.query(statement, (error, admins) => {
        connection.end()
        
        if (admins.length == 0) {
            response.send(utils.createResult('user does not exist'))
        } else {
            const admin = admins[0]
            const info = {
                admin_name: admin['admin_name'],
                password: admin['password'],
                role: admin['role']
            }
            response.send(utils.createResult(null, info))
        }
    })
})

module.exports = router