const db = require('./db')
const utils = require('./utils')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'thumbnails/'})

const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    const statement = `select * from labour_chart`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})
router.post('/productname', (request, response) => {
    const connection = db.connect()
    const statement = `select lc_product_name from labour_chart`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.post('/',upload.single('thumbnail'), (request, response) => {

    const {lc_product_code,lc_product_name,lc_charge,gst,type_of_making,purity} = request.body
    console.log(request.formData)
    console.log(lc_product_code+lc_product_name+lc_charge+gst+type_of_making+purity)
    const connection = db.connect()
    const statement = `insert into labour_chart (lc_product_code,lc_product_name,lc_charge,gst,type_of_making,purity) values ('${lc_product_code}', '${lc_product_name}','${lc_charge}','${gst}','${type_of_making}','${purity}')`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

module.exports = router