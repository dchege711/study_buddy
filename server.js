var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var CardsDB = require('./server_side_scripts/CardsMongoDB');

var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// I deleted this line...
// app.use(express.static(__dirname + '/react_app/public'));
// ..so that I could have this instead
app.use(express.static(path.join(__dirname + '/client_side_react/build')));

app.get('/', function(request, response) {
    // response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    response.sendFile(path.join(__dirname + "/client_side_react/build/index.html"));
});

app.post('/read-card', function(request, response) {
    console.log("POST request at /read-card");
    CardsDB.read(request.body, function(card) {
        response.json(card);
    });
});

app.post('/add-card', function(request, response) {
    console.log("POST request at /add-card. Data: " + request.body);
    CardsDB.create(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.post('/update-card', function(request, response) {
    console.log("POST request at /update-card. Data: " + request.body);
    CardsDB.update(request.body, function(confirmation) {
        console.log("Responding with: " + confirmation);
        response.json(confirmation);
    });
});

app.post('/delete-card', function(request, response) {
    CardsDB.delete(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.listen(port, function() {
    console.log(`API is running on port ${port}`);
});
