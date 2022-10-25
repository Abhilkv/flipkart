var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
var nodemailer = require('nodemailer');
const port = 3000;

var app = express();

app.use(express.json())
app.use(cors())

app.listen(process.env.PORT || port, () => { console.log('server listening at 8081...')});

var mongoDB = 'mongodb://127.0.0.1/flipkart';
mongoose.connect("mongodb+srv://flipkart:Abhil2022@cluster0.eo9hubb.mongodb.net/flipkart").then((data) => {
    console.log("Connection established");
})
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection errro') );
mongoose.pluralize(null);


// CREATING SCHEMA
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    "name": String,
    "avatar": String,
    "description": String,
    "features": Array,
    "price": Number,
    "category": String,
    "searchKeys": Array,
    "brand": String,
    "gender": Array,
    "promoLine": String,
    "rating": String,
    "offerText": String,
    "discount": Number,
    "tags": Array,
    "seller": String,
    "sellerRating": Number,
    "services": Array,
    "general": Object,
    "warranty": Array,
    "productDetails": Object,
});

var CategorySchema = new Schema({
    "name": String
});

var OrderSchema = new Schema({
    "items": Object,
    "userData": Object,
    "Status": String,
    "payment": String,
    "amount": Number
});

var ProductTable = mongoose.model('products', ProductSchema);
var CategoryTable = mongoose.model('category', CategorySchema);
var OrderTable = mongoose.model('orders', OrderSchema);


// GET All products
app.get('/products', (req, res) => {
    var search = req.query.search;
    var category = req.query.category;
    var gender = req.query.gender;
    var rating = req.query.rating;
    var key = {};
    if (search) {
        key = ({$or: [{"name": { $regex: search, $options: 'i' }}, {"brand": { $regex: search, $options: 'i' }},  { "searchKeys": { $elemMatch: { $regex: search, $options: 'i' }}}]})
    }
    if (category) {
        key = {"category": {$eq: category}}
    }
    if (gender) {
        key = { "gender": {$eq: gender}}
    }
    if (rating) {
        key = { "rating": {$gte: rating}}
    }

    ProductTable.find(key, {name: 1, brand: 1, avatar: 1, price: 1, promoLine: 1, rating: 1, offerText: 1, discount: 1}).then((data) => {
        console.log(data);

        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't fetch products data");
        res.status(404).send(err);
    })
})

app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    ProductTable.find({"_id": {$eq: id}}).then((data) => {
        console.log(data);

        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't fetch product  data");
        res.status(404).send(err);
    })
})

// delete data
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    ProductTable.deleteOne({"_id": {$eq: id}}).then((data) => {
        console.log('Entry deleted');

        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't delete product  data");
        res.status(404).send(err);
    })
})


// Update data
app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    ProductTable.updateOne({"_id": {$eq: id}}, {$set: req.body}).then((data) => {
        console.log('Entry updated');

        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't delete product  data");
        res.status(404).send(err);
    })
})


//Get categories
app.get('/categories', (req, res) => {
    CategoryTable.find().then((data) => {
        console.log(data);
        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't fetch category data");
        res.status(404).send(err);
    })
})

//ADD category
app.post('/categories', (req, res) => {
    var name =  req.body.name;
    console.log(name);
    var categoryObj = new CategoryTable({"name": name});
    categoryObj.save((err, result) => {
        if (err) {
            console.log("Failed to save data");
            res.status(400).send("Failed to save data")
        } else {
            console.log("saved category data");
            res.status(201).send("saved category data")
        }
    })
})

// POST add product
app.post('/products', (req, res) => {
    var name =  req.body.name;
    var avatar = req.body.avatar;
    var description = req.body.description;
    var features = (req.body.features);
    var price = req.body.price;
    var category = req.body.category;
    var searchKeys = (req.body.searchKeys);
    var brand = req.body.brand;
    var promoLine = req.body.promoLine;
    var gender = (req.body.gender);
    var rating = req.body.rating;
    var offerText = req.body.offerText;
    var discount = req.body.discount;
    var tags = (req.body.tags);
    var services =( req.body.services);
    var warranty = (req.body.warranty);
    console.log(`Warranty: ${warranty}`);
    var productObj = new ProductTable({"name": name,
        "avatar": avatar,
        "description": description,
        "category": category,
        "price": price,
        "features": features,
        "searchKeys": searchKeys,
        "brand": brand,
        "promoLine": promoLine,
        "gender": gender,
        "rating": rating,
        "offerText": offerText,
        "discount": discount,
        "tags": tags,
        "warranty": warranty,
        "services": services
        });
    productObj.save((err, result) => {
        if (err) {
            console.log("Failed to save data");
            res.status(400).send("Failed to save data")
        } else {
            console.log("saved product data");
            console.log(result)
            res.status(201).send((result._id));
        }
    })
})

//POST add orders
app.post('/orders', (req, res) => {
    console.log(req.body);
    var body = req.body
    var items =  req.body.items;
    var userData = req.body.userData;
    var payment = req.body.payment
    var amount = req.body.amount

    console.log(req.body);
    var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
        auth: {
            user: 'order.reply.amazon@gmail.com',
            // pass: 'AmazonClone@123'
            pass: 'ihslsuxvtxkddgdp'
        }
    });

    console.log(userData);

    var orderObj = new OrderTable({"items": items,
        "userData": userData,
        "payment": payment,
        "status": 'Order accepted',
        "amount": amount
        });
        orderObj.save((err, result) => {
        if (err) {
            console.log("Failed to save order data");
            res.status(400).send("Failed to save orderdata")
        } else {
            console.log("saved order data");
            var mailOptions = {
                from: 'order.reply.amazon@gmail.com',
                to: userData.email,
                subject: 'Your order has placed',
                text: `Dear ${userData.name}, \n \n Thanks for purchasing with us. \n Please wait for 3-4 business days to get your order delivered. \n For any help feel free to contact us at (1800 1154 2365). your order id is  ${result._id}. \n \n Thanks & Regards  \n Team Amazon `
            };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.status(201).send({ orderId: result._id });
        }
    })
})

app.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    OrderTable.find({"_id": {$eq: id}}).then((data) => {
        console.log(data);
        res.status(200).send(data);
    }).catch((err) => {
        console.log("Couldn't fetch Order  data");
        res.status(404).send(err);
    })
})
