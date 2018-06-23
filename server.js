var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var CardsDB = require('./server_side_scripts/CardsMongoDB.js');
var MetadataDB = require('./server_side_scripts/MetadataMongoDB.js');
var LogInUtilities = require('./server_side_scripts/LogInUtilities.js');

// Needed to get a Mongoose instance running for this process
require("./server_side_scripts/MongooseClient.js");

// Set up the authentication procedure
passport.use(new LocalStrategy(
    {
        passReqToCallback: true,
        session: true
    },
    function(request, username, password, done) {
        LogInUtilities.authenticateUser(request.body, function (confirmation) {
            if (confirmation.status === 200) {
                if (confirmation.success) {
                     
                }
            }
        });
    }
));

var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* 
 * Login and authentication endpoints 
 * 
 */

app.get('/', function(request, response) {
    response.render("pages/welcome_page");
});

app.post('/register-user', function(request, response) {
    LogInUtilities.registerUserAndPassword(request.body, function(confirmation) {
        convertObjectToResponse(confirmation, response);
    });
});

app.post('/login', function(request, response) {
    LogInUtilities.authenticateUser(request.body, function(confirmation) {
        convertObjectToResponse(confirmation, response);
    });
});

app.get('/send-validation-email', function (request, response) {
    response.render("pages/send_validation_url.ejs");
});

app.post('/send-validation-email', function (request, response) {
    LogInUtilities.sendAccountValidationLink(request.body, (confirmation) => {
        convertObjectToResponse(confirmation, response);
    });
});

app.get('/verify-account/*', function (request, response) {
    var verification_uri = request.path.split("/verify-account/")[1];
    LogInUtilities.validateAccount(verification_uri, (results) => {
        convertObjectToResponse(results, response);
    });
});

app.get('/reset-password', function (request, response) {
    response.render("pages/reset_password_request.ejs");
});

app.post('/reset-password', function (request, response) {
    LogInUtilities.sendResetLink(request.body, (confirmation) => {
        convertObjectToResponse(confirmation, response);
    });
});

app.get('/reset-password-link/*', function (request, response) {
    var reset_password_uri = request.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            response.render("pages/reset_password.ejs");
        } else {
            convertObjectToResponse(results, response);
        }
    });
});

app.post('/reset-password-link/*', function (request, response) {
    var reset_password_uri = request.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            var payload = request.body;
            payload.reset_password_uri = reset_password_uri;
            var todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            LogInUtilities.resetPassword(payload, (confirmation) => {
                convertObjectToResponse(confirmation, response);
            });
        } else {
            convertObjectToResponse(confirmation, results);
        }
    });
});

/*
 * Interacting with Study Buddy Content
 * 
 */ 

app.post('/read-card', function(request, response) {
    CardsDB.read(request.body, function(card) {
        response.json(card);
    });
});

app.get('/home', function(request, response) {
    response.render("pages/home.ejs");
});

app.post('/read-metadata', function (request, response) {
    MetadataDB.read(request.body, function (metadata) {
        response.json(metadata);
    });
});

app.post('/tags', function (request, response) {
    MetadataDB.readTags(request.body, function (tags) {
        response.json(tags);
    });
});

app.post('/add-card', function(request, response) {
    CardsDB.create(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.post('/update-card', function(request, response) {
    CardsDB.update(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.post('/delete-card', function(request, response) {
    CardsDB.delete(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.post('/trash-card', function (request, response) {
    MetadataDB.send_to_trash(request.body, function (confirmation) {
        response.json(confirmation);
    });
});

app.post('/restore-from-trash', function (request, response) {
    MetadataDB.restore_from_trash(request.body, function (confirmation) {
        response.json(confirmation);
    });
});

/**
 * @description A function to interpret JSON documents into server responses.
 * 
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * 
 * @param {Response} response An Express JS response object 
 */
convertObjectToResponse = function(result_JSON, response) {
    if (result_JSON.status < 400) {
        response.json(result_JSON);
    } else if (result_JSON.status >= 400 && result_JSON.status < 500) {
        response.render("pages/4xx_error_page.ejs", { response_JSON: result_JSON });
    } else {
        response.render("pages/5xx_error_page.ejs", { response_JSON: result_JSON });
    }
};

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});

app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.render(
        "pages/4xx_error_page.ejs", 
        {response_JSON: {status: 404, message: "Page Not Found"}}
    );
});
