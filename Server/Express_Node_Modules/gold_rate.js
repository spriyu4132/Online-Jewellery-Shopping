const db = require('./db')
const utils=require('./utils')
const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    const statement = `select * from gold_rate`
    connection.query(statement, (error, data) => {
        connection.end()

        response.send(utils.createResult(error, data))
    })
})
router.put('/:purity', (request, response) => {
    const purity=request.params.purity
    const daily_rate_per_gram=request.body.daily_rate_per_gram

    const connection = db.connect()
    const statement = `update gold_rate set daily_rate_per_gram=${daily_rate_per_gram} where purity=${purity}`
    connection.query(statement, (error, data) => {
        connection.end()

        response.send(utils.createResult(error, data))
    })
})
module.exports = router