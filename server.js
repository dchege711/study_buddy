// https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50

var express = require('express');
var bodyParser = require('body-parser');
var CardController = require('./react_app/src/controllers/CardController');

var app = express();
var port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/react_app/public'));

app.get('/', function(request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/read-card', function(request, response) {
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