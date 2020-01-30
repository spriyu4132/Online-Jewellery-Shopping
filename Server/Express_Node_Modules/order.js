const db = require('./db')
const utils = require('./utils')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'thumbnails/'})
const date = require('date-and-time');

var now = new Date();
var order_date=date.format(now, 'YYYY/MM/DD HH:mm:ss')

var someDate = new Date(order_date);
someDate.setDate(someDate.getDate() + 15); //number  of days to add, e.x. 15 days
var deliverd_date = someDate.toISOString().substr(0,10)

const router = express.Router()

//router.post('/addorder/:p_id/:user_id',upload.single('thumbnail'), (request, response) => {
    router.post('/addorder',upload.single('thumbnail'), (request, response) => {
    const {p_id,user_id} = request.body
    //const {order_date,deliverd_date} = request.body
    const connection = db.connect()
    const statement = `insert into order_details(p_id,user_id,order_date,deliverd_date) values('${p_id}','${user_id}','${order_date}','${deliverd_date}')`
    // connection.query(statement, (error, data) => {
    //     connection.end()
    //     response.send(utils.createResult(error, data))
    // })
    connection.query(statement, (error, data) => {

        // delete the products from this category
        const statement2 = `update product set available_quantity=(available_quantity-1) where p_id=${p_id}`
        connection.query(statement2, (error, data) => {
            connection.end()
            response.send(utils.createResult(error, data))
        })
    })
})



router.get('/:user_id', (request, response) => {
    const {user_id} = request.params
    const connection = db.connect()
    //const statement=`select * from order_details where user_id=${user_id}`
    //const statement = `select a.*,p.image,l.lc_product_name,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total from add_to_cart a inner join product p on a.p_id=p.p_id inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on l.purity=g.purity where a.email_id='${email_id}'`
    const statement = `select o.order_code,u.first_name,c.*,o.order_date,o.deliverd_date from order_details o inner join user_info u on o.user_id=u.user_id inner join city_details c on u.pincode=c.pincode where o.user_id=${user_id}`;
    connection.query(statement, (error, data) => {

            connection.end()
                response.send(utils.createResult(error, data))
        })
    })

    router.get('/', (request, response) => {
        //const {user_id} = request.params
        const connection = db.connect()
        //const statement=`select * from order_details where user_id=${user_id}`
        //const statement = `select a.*,p.image,l.lc_product_name,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total from add_to_cart a inner join product p on a.p_id=p.p_id inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on l.purity=g.purity where a.email_id='${email_id}'`
        //const statement = `select l.lc_product_name,o.* from order_details o inner join product p on o.p_id=p.p_id inner join labour_chart l on p.lc_product_code=l.lc_product_code`;
        const statement = `select l.lc_product_name,o.*,u.first_name,c.* from order_details o inner join product p on o.p_id=p.p_id inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join user_info u on o.user_id=u.user_id inner join city_details c on u.pincode=c.pincode`;
        connection.query(statement, (error, data) => {
    
                connection.end()
                    response.send(utils.createResult(error, data))
            })
        })


module.exports = router