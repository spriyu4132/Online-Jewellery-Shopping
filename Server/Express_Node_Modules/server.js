const express = require('express')
const bodyParser = require('body-parser')
const date = require('date-and-time');

// import the routers
const routerAdmin = require('./admin')
const routerUser = require('./user')
const routergoldrate = require('./gold_rate')
const routerlabour_chart = require('./labour_chart')
const routercategory = require('./category')
const routerproduct = require('./product')
const routerstock = require('./stock')
const routerpincode = require('./pincode')
const routerorder = require('./order')

const app = express()

// add middlewares

// for CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json())
app.use(express.static('thumbnails'))
app.use('/admin', routerAdmin)
app.use('/user', routerUser)
app.use('/gold_rate', routergoldrate)
app.use('/labour_chart', routerlabour_chart)
app.use('/category', routercategory)
app.use('/product', routerproduct)
app.use('/stock', routerstock)
app.use('/pincode', routerpincode)
app.use('/order', routerorder)

app.listen(10000, '0.0.0.0', () => {
    console.log('server started  on port 10000')
})