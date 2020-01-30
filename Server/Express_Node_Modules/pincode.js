const db = require('./db')
const utils = require('./utils')
const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    //const statement = `select * from city_details where pincode=${pincode}`
    const statement = `select * from city_details`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})
router.get('/getcity', (request, response) => {
    //const pincode = request.params.pincode
    const connection = db.connect()
    const statement = `select city,state from city_details`
   // const statement = `select * from city_details`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

module.exports = router