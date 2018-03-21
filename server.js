var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var CardsDB = require('./server_side_scripts/CardsMongoDB');
var MetadataDB = require('./server_side_scripts/MetadataMongoDB');
var LogInUtilities = require('./server_side_scripts/LogInUtilities');

// https://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
// var myEmmiter = new MyEmmiter();
// myEmmiter.setMaxListeners(Infinity);

const debugMode = true;

var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/client_side_react/build')));

app.get('/', function(request, response) {
    // response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    response.sendFile(path.join(__dirname + "/client_side_react/build/index.html"));
});

app.post('/register-user', function(request, response) {
    console.log("POST request at /register-user");
    if (debugMode) {
        console.log(request.body);
    }
    
    LogInUtilities.registerUserAndPassword(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        response.json(confirmation);
    });
});

app.post('/login', function(request, response) {
    console.log("POST request at /login");
    if (debugMode) {
        console.log(request.body);
    }

    LogInUtilities.authenticateUser(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        response.json(confirmation);
    });
});

app.post('/read-card', function(request, response) {
    console.log("POST request at /read-card");
    if (debugMode) {
        console.log(request.body);
    }
    
    CardsDB.read(request.body, function(card) {
        if (debugMode) console.log(card);
        response.json(card);
    });
});

app.post('/read-metadata', function (request, response) {
    console.log("POST request at /read-metadata");
    if (debugMode) {
        console.log(request.body);
    }

    MetadataDB.read(request.body, function (metadata) {
        if (debugMode) console.log(metadata);
        response.json(metadata);
    });
});

app.post('/add-card', function(request, response) {
    console.log("POST request at /add-card.");
    if (debugMode) {
        console.log(request.body);
    }
    
    CardsDB.create(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        response.json(confirmation);
    });
});

app.post('/update-card', function(request, response) {
    console.log("POST request at /update-card.");
    if (debugMode) {
        console.log(request.body);
    }
    
    CardsDB.update(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        response.json(confirmation);
    });
});

app.post('/delete-card', function(request, response) {
    console.log("POST request at /delete-card");
    if (debugMode) {
        console.log(request.body);
    }
    
    CardsDB.delete(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        response.json(confirmation);
    });
});

app.listen(port, function() {
    console.log(`API is running on port ${port}`);
});
