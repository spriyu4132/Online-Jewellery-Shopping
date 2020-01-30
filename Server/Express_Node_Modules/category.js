const db = require('./db')
const utils = require('./utils')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'thumbnails/'})

const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    const statement = `select * from category`
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

    const {category_id,category_name} = request.body
    console.log(request.formData)
    //console.log(lc_product_code+lc_product_name+lc_charge+gst+type_of_making+purity)
    const connection = db.connect()
    const statement = `insert into category (category_id,category_name) values ('${category_id}', '${category_name}')`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.put('/:category_id', (request, response) => {
    const category_id = request.params.category_id
    const category_name = request.body.category_name

    const connection = db.connect()
    //const statement = `update category set category_name = '${category_name}' where category_id = ${category_id}`  for Postmon
    const statement = `update category set category_name = '${category_name}' where category_id = '${category_id}'`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.delete('/:category_id', (request, response) => {
    const {category_id} = request.params
    const connection = db.connect()
    const statement = `delete from product where category_id = '${category_id}'`
    
    connection.query(statement, (error, data) => {

        // delete the products from this category
        const statement2 = `delete from category where category_id = '${category_id}'`
        connection.query(statement2, (error, data) => {
            connection.end()
            response.send(utils.createResult(error, data))
        })
    })
})

// router.get('/details/:category_id', (request, response) => {
//     const {category_id} = request.params
//     const connection = db.connect()
//     const statement = `select category.* from category where  category_id = ${category_id}`
//     connection.query(statement, (error, cats) => {
//         connection.end()
//         if (cats.length > 0) {
//             response.send(utils.createResult(error, cats[0]))
//         } else {
//             response.send(utils.createResult('cats does not exist'))
//         }
//     })
// })

module.exports = router