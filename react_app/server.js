'use strict';

// https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50

var express = require('express');
var bodyParser = require('body-parser');
var CardController = require('./src/controllers/CardController');

var app = express();
var router = express.Router();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET,HEAD,OPTIONS,POST,PUT,DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );
    next();
});

router.get('/', function(request, response) {
    response.json({message: "This is what you get when you route to /"});
});

router.route('/read-card').get(function(request, response) {
    CardController.read(request.body, function(card) {
        
    });
});

router.route('/add-card').post(function(request, response) {
    CardController.create(request.body, function(confirmation) {
        
    });
});

router.route('/update-card').post(function(request, response) {
    CardController.update(request.body, function(confirmation) {
        
    });
});

router.route('/delete-card').post(function(request, response) {
    CardController.delete(request.body, function(confirmation) {
        
    });
});

app.use('/', router);

app.listen(port, function() {
    console.log(`API is running on port ${port}`);
});
