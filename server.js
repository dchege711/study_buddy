var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var CardsDB = require('./server_side_scripts/CardsMongoDB');
var MetadataDB = require('./server_side_scripts/MetadataMongoDB');
var LogInUtilities = require('./server_side_scripts/LogInUtilities');

require("./server_side_scripts/MongooseClient");

const debugMode = false;

var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render("pages/welcome_page");
});

app.post('/register-user', function(request, response) {
    console.log("POST request at /register-user");
    if (debugMode) {
        console.log(request.body);
    }
    
    LogInUtilities.registerUserAndPassword(request.body, function(confirmation) {
        if (debugMode) console.log(confirmation);
        if (confirmation.success) {
            LogInUtilities.authenticateUser(request.body, function (login_confirmation) {
                if (debugMode) console.log(login_confirmation);
                response.json(login_confirmation);
            });
        } else {
            response.json(confirmation);
        }
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

app.get('/home', function(request, response) {
    response.render("pages/home.ejs");
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

app.post('/tags', function (request, response) {
    console.log("POST request at /tags");
    if (debugMode) {
        console.log(request.body);
    }

    MetadataDB.readTags(request.body, function (tags) {
        if (debugMode) console.log(tags);
        response.json(tags);
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
    console.log(`App is running on port ${port}`);
});
