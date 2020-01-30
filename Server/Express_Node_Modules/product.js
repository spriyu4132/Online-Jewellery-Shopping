const db = require('./db')
const utils = require('./utils')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'thumbnails/'})

const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    //const statement =`select * from product`
    //const statement = `select p.*,l.lc_product_name,l.lc_charge,l.gst,l.type_of_making,l.purity from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code`
    const statement=`select p.*,l.lc_product_name,l.lc_charge,l.gst,l.type_of_making,l.purity,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on g.purity=l.purity order by p_id`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    }) 
})

router.get('/userproductlist', (request, response) => {
    const connection = db.connect()
    //const statement =`select * from product`
    //const statement = `select p.*,l.lc_product_name,l.lc_charge,l.gst,l.type_of_making,l.purity from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code`
   // const statement=`select p.p_id,p.image,p.weight_per_garm,p.available_quantity,p.description,l.lc_product_name,l.lc_charge,l.gst,l.purity,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on g.purity=l.purity order by p_id`
   const statement=`select p.p_id,p.image,p.weight_per_garm,p.available_quantity,p.description,l.lc_product_name,l.lc_charge,l.gst,l.purity,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total,p.rating from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on g.purity=l.purity order by p_id`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.get('/details/:p_id', (request, response) => {
    const {p_id} = request.params
    const connection = db.connect()
    const statement=`select p.p_id,p.image,p.weight_per_garm,p.available_quantity,p.description,l.lc_product_name,l.lc_charge,l.gst,l.purity,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total,p.rating from product p inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on g.purity=l.purity where p_id=${p_id}`
    //const statement = `select movie.*, genre.title as genre_title from movie, genre where movie.genre = genre.id and movie.id = ${id}`
    connection.query(statement, (error, products) => {
        connection.end()
        if (products.length > 0) {
            response.send(utils.createResult(error, products[0]))
        } else {
            response.send(utils.createResult('product does not exist'))
        }
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

router.post('/',upload.single('image'), (request, response) => {

    const {lc_product_code,category_id,weight_per_garm,available_quantity,description,rating} = request.body
    const image=request.file.filename
    console.log(request.formData)
    //console.log(lc_product_code+lc_product_name+lc_charge+gst+type_of_making+purity)
    const connection = db.connect()
    const statement = `insert into product (lc_product_code,category_id,weight_per_garm,available_quantity,description,image,rating) values ('${lc_product_code}','${category_id}','${weight_per_garm}','${available_quantity}','${description}','${image}','${rating}')`
   //const statement = `insert into product (p_id,lc_product_code,category_id,weight_per_garm,available_quantity,description,image) values (?,?,?,?,?,?,?)`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.put('/:p_id', (request, response) => {
    const p_id = request.params.p_id
    const {lc_product_code,category_id,weight_per_garm,available_quantity,description} = request.body
    const connection = db.connect()
    const statement = `update product set lc_product_code = '${lc_product_code}',category_id='${category_id}',weight_per_garm='${weight_per_garm}', available_quantity='${available_quantity}',description='${description}' where p_id = ${p_id}`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.delete('/:p_id', (request, response) => {
    const {p_id} = request.params
    const connection = db.connect()
    const statement = `delete from product where p_id = ${p_id}`
    
    connection.query(statement, (error, data) => {

        // delete the products from this category
        //const statement2 = `delete from category where category_id = '${category_id}'`
        //connection.query(statement2, (error, data) => {
            connection.end()
            response.send(utils.createResult(error, data))
        })
    })


module.exports = router