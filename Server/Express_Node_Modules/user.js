const db = require('./db')
const utils=require('./utils')
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'thumbnails/'})
const mailer = require('./mailer')


const router = express.Router()

router.get('/', (request, response) => {
    const connection = db.connect()
    const statement = `select * from user_info`
    connection.query(statement, (error, data) => {
        connection.end()
        const users = []
        for (let index = 0; index < data.length; index++) {
            const user = data[index]
            users.push({
                first_name:user['first_name'],
                last_name:user['last_name'],
                gender:user['gender'],
                email_id: user['email_id'],
                password: user['password'],
                mobile_no:user['mobile_no'],
                location_id:user['location_id'],
                pincode:user['pincode'],
                role: user['role']
            })
        }
        response.send(utils.createResult(error, users))
    })
})

router.post('/',upload.single('thumbnail'), (request, response) => {
    const {first_name,last_name,gender,email_id,password,mobile_no,pincode} = request.body
    //const encryptedPassword = '' + cryptoJs.MD5(password)
    const connection = db.connect()
    const statement = `insert into user_info (first_name,last_name,gender,email_id,password,mobile_no,pincode) values ('${first_name}','${last_name}','${gender}','${email_id}','${password}',${mobile_no},'${pincode}')`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.post('/cart',upload.single('thumbnail'), (request, response) => {
    const {p_id,email_id} = request.body
    //const encryptedPassword = '' + cryptoJs.MD5(password)
    const connection = db.connect()
    const statement = `insert into add_to_cart (p_id,email_id) values (${p_id},'${email_id}')`
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.post('/login', (request, response) => {
    const {email_id, password} = request.body
    //const encryptedPassword = '' + cryptoJs.MD5(password)
    const connection = db.connect()
    const statement = `select * from user_info where email_id = '${email_id}' and password = '${password}'`
    connection.query(statement, (error, users) => {
        connection.end()
        
        if (users.length == 0) {
            response.send(utils.createResult('user does not exist'))
        } else {
            const user = users[0]
            const info = {
                email_id: user['email_id'],
                password: user['password'],
                user_id:user['user_id'],
                role: user['role']
            }
            response.send(utils.createResult(null, info))
        }
    })
})

router.get('/:email_id', (request, response) => {
    const {email_id} = request.params
    const connection = db.connect()
    const statement = `select a.*,p.image,l.lc_product_name,(p.weight_per_garm*(g.daily_rate_per_gram+l.lc_charge))*3 as Total from add_to_cart a inner join product p on a.p_id=p.p_id inner join labour_chart l on p.lc_product_code=l.lc_product_code inner join gold_rate g on l.purity=g.purity where a.email_id='${email_id}'`
    
    connection.query(statement, (error, data) => {

        // delete the products from this category
        //const statement2 = `delete from category where category_id = '${category_id}'`
        //connection.query(statement2, (error, data) => {
            connection.end()
            response.send(utils.createResult(error, data))
        })
    })

    router.get('/getuserid:user_id', (request, response) => {
        const {email_id} = request.params
        const connection = db.connect()
        const statement = `select user_id from user_info where user_id='${user_id}'`
        
        connection.query(statement, (error, users) => {
    
            // delete the products from this category
            //const statement2 = `delete from category where category_id = '${category_id}'`
            //connection.query(statement2, (error, data) => {
                connection.end() 
                if (users.length == 0) {
                    response.send(utils.createResult('user does not exist'))
                } else {
                    const user = users[0]
                    const info = {
                        user_id: user['user_id']
                       
                    }
                }

                response.send(utils.createResult(null, info))
            })
        })


    router.delete('/:sr_no', (request, response) => {
        const {sr_no} = request.params
       //const {email_id} = request.body
        const connection = db.connect()
        const statement = `delete from add_to_cart where sr_no = ${sr_no}`
        
        connection.query(statement, (error, data) => {
    
            // delete the products from this category
            //const statement2 = `delete from category where category_id = '${category_id}'`
            //connection.query(statement2, (error, data) => {
                connection.end()
                response.send(utils.createResult(error, data))
            })
        })
        router.get('/details/:email_id', (request, response) => {
            const {email_id} = request.params
            const connection = db.connect()
            const statement = `select user_info.* from user_info where  email_id = '${email_id}'`
            connection.query(statement, (error, users) => {
                connection.end()
                if (users.length > 0) {
                    response.send(utils.createResult(error, users[0]))
                } else {
                    response.send(utils.createResult('user does not exist'))
                }
            })
        })

        router.put('/:email_id', (request, response) => {
             const email_id = request.params.email_id
             const {first_name,last_name,gender,mobile_no,pincode} = request.body
             const connection = db.connect()
             const statement = `update user_info set first_name = '${first_name}',last_name='${last_name}', gender='${gender}',mobile_no='${mobile_no}',pincode='${pincode}' where email_id = '${email_id}'`
             connection.query(statement, (error, data) => {
                 connection.end()
                 response.send(utils.createResult(error, data))
             })
         })

         router.post('/forgot-password', (request, response) => {
            const {email_id} = request.body
            const connection = db.connect()
            const statement = `select user_id from user_info where email_id = '${email_id}'`
            connection.query(statement, (error, users) => {
                connection.end()
                
                if (users.length == 0) {
                    response.send(utils.createResult('user does not exist'))
                } else {
                    const user = users[0]
                    const user_id = user['user_id']
        
                    const link = "http://localhost:4200/reset-password/"+user_id
                    console.log(link)
        
                    const body = `<h1>welcome</h1>Please follow the link to reset your password: <br><br>${link}`
        
                    mailer.send(email_id, body, 'link to reset your password', (error) => {
                        response.send(utils.createResult(error))
                    })
                }
            })
        })

        router.post('/reset-password', (request, response) => {
            const {user_id, password} = request.body
           // const encryptedPassword = '' + cryptoJs.MD5(password)
            const connection = db.connect()
            const statement = `update user_info set password = '${password}' where user_id = ${user_id}`
            connection.query(statement, (error, data) => {
                connection.end()
                response.send(utils.createResult(error, data))
            })
        })
module.exports = router
