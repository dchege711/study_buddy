var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const url = require("url");

var CardsDB = require('./server_side_scripts/CardsMongoDB');
var MetadataDB = require('./server_side_scripts/MetadataMongoDB');
var LogInUtilities = require('./server_side_scripts/LogInUtilities');

require("./server_side_scripts/MongooseClient");

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
    LogInUtilities.registerUserAndPassword(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

app.post('/login', function(request, response) {
    LogInUtilities.authenticateUser(request.body, function(confirmation) {
        response.json(confirmation);
    });
});

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

app.get('/send-validation-email', function(request, response) {
    response.render("pages/send_validation_url.ejs");
});

app.post('/send-validation-email', function (request, response) {
    LogInUtilities.sendAccountValidationLink(request.body, (confirmation) => {
        response.json(confirmation);
    });
});

app.get('/verify-account/*', function (request, response) {
    var verification_uri = request.path.split("/verify-account/")[1];
    LogInUtilities.validateAccount(verification_uri, (results) => {
        if (results.status === 200) {
            response.redirect(302, "/?verified=" + encodeURIComponent(results.message));
        } else {
            response.render("pages/500_error_page.ejs");
        }
    });
});

app.get('/reset-password', function (request, response) {
    response.render("pages/reset_password_request.ejs");
});

app.post('/reset-password', function (request, response) {    
    LogInUtilities.sendResetLink(request.body, (confirmation) => {
        if (confirmation.success) {
            response.json({
                success: true, 
                message: `Please check ${request.body.email} for a reset link`
            });
        } else {
            response.json({
                success: false,
                message: `Unsuccessful: Was there a typo in ${request.body.email}?`
            });
        }
    });
});

app.get('/reset-password-link/*', function(request, response) {
    var reset_password_uri = request.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            response.render("pages/reset_password.ejs");
        } else {
            response.render("pages/404_error_page.ejs");
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
                if (confirmation.success) {
                    response.json({
                        success: true, 
                        message: "Password reset was successful!"
                    });
                } else {
                    console.error(`Error on password reset: ${response.message}`);
                    response.json({
                        success: true,
                        message: "Internal Server Error. Please try again later."
                    });
                }
            });
        } else {
            response.json(results);
        }
    });
});

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});

app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.render("pages/404_error_page.ejs");
});
