'use strict';

// https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50

var express = require('express');
var bodyParser = require('body-parser');
var CardController = require('./src/controllers/CardController');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    console.log("Received a GET request at /. Returning a JSON object...")
    response.json({message: "This is what you get when you route to /"});
});

app.get('/read-card', function(request, response) {
    console.log("Received GET request for read-card");
    CardController.read(request.body, function(card) {
        response.json(card);
    });
});

app.post('/add-card', function(request, response) {
    CardController.create(request.body, function(confirmation) {
        
    });
});

app.post('/update-card', function(request, response) {
    CardController.update(request.body, function(confirmation) {
        
    });
});

app.post('/delete-card', function(request, response) {
    CardController.delete(request.body, function(confirmation) {
        
    });
});

app.listen(port, function() {
    console.log(`API is running on port ${port}`);
});
