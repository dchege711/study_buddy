var express = require('express');
var session = require("express-session");
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");

var CardsDB = require('./server_side_scripts/CardsMongoDB.js');
var MetadataDB = require('./server_side_scripts/MetadataMongoDB.js');
var LogInUtilities = require('./server_side_scripts/LogInUtilities.js');

// Needed to get a Mongoose instance running for this process
require("./server_side_scripts/MongooseClient.js");

var app = express();
var port = process.env.PORT || 5000;

/**
 * @description Middleware designed to ensure that users are logged in before 
 * using certain URLs in Study Buddy
 */
function requireLogIn(req, res, next) {
    if (!req.session.user) res.redirect("/login");
    else if (req.session.user) next();
    else if (req.cookies.session_token) {
        logInBySessionToken(req.cookies.session_token, res, next);
    }
}

/**
 * @description Middleware for authenticating browsers that provide a session
 * token.
 */
function logInBySessionToken(req, res, next) {
    LogInUtilities.authenticateByToken(
        req.cookies.session_token, (auth_response) => {
            if (auth_response.success) {
                req.session.user = auth_response.message;
                next();
            } else {
                res.setHeader(
                    "Set-Cookie",
                    [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
                );
                res.redirect("/login");
            }
        }
    );
}

function handleLogIn(req, res) {
    if (req.session.user) {
        res.redirect("/home");
    } else if (req.cookies.session_token) {
        logInBySessionToken(req, res, function () { res.redirect("/home"); });
    } else {
        res.render("pages/welcome_page");
    }
}

app.use(session({
    secret: "bad secret",
    httpOnly: false,
    resave: false,
    name: "c13u-study-buddy",
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* 
 * Login and authentication endpoints 
 * 
 */

app.get("/", handleLogIn);
app.get("/login", handleLogIn);

app.post('/register-user', function(req, res) {
    LogInUtilities.registerUserAndPassword(req.body, function(confirmation) {
        convertObjectToResponse(confirmation, res);
    });
});

app.post('/login', function(req, res, next) {
    LogInUtilities.authenticateUser(req.body, function (confirmation) {
        if (confirmation.status === 200 && confirmation.success) {
            req.session.user = confirmation.message;
            var expiry_date = new Date(Date.now() + 1000 * 3600 * 24 * 30);
            expiry_date = expiry_date.toString();
            res.setHeader(
                "Set-Cookie", 
                [`session_token=${confirmation.message.token_id};Expires=${expiry_date}`]
            );
        }
        convertObjectToResponse(confirmation, res);
    });
});

app.post("/logout", function(req, res) {
    var session_token = req.session.user.token_id;
    delete req.session.user;
    LogInUtilities.deleteSessionToken(session_token, (delete_info) => {
        res.setHeader(
            "Set-Cookie",
            [`session_token=null;Expires=Thu, 01 Jan 1970 00:00:00 GMT`]
        );
        convertObjectToResponse(delete_info, res);
    });
});

app.get('/send-validation-email', function (req, res) {
    res.render("pages/send_validation_url.ejs");
});

app.post('/send-validation-email', function (req, res) {
    LogInUtilities.sendAccountValidationLink(req.body, (confirmation) => {
        convertObjectToResponse(confirmation, res);
    });
});

app.get('/verify-account/*', function (req, res) {
    var verification_uri = req.path.split("/verify-account/")[1];
    LogInUtilities.validateAccount(verification_uri, (results) => {
        convertObjectToResponse(results, res);
    });
});

app.get('/reset-password', function (req, res) {
    res.render("pages/reset_password_request.ejs");
});

app.post('/reset-password', function (req, res) {
    LogInUtilities.sendResetLink(req.body, (confirmation) => {
        convertObjectToResponse(confirmation, res);
    });
});

app.get('/reset-password-link/*', function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            res.render("pages/reset_password.ejs");
        } else {
            convertObjectToResponse(results, res);
        }
    });
});

app.post('/reset-password-link/*', function (req, res) {
    var reset_password_uri = req.path.split("/reset-password-link/")[1];
    LogInUtilities.validatePasswordResetLink(reset_password_uri, (results) => {
        if (results.success) {
            var payload = req.body;
            payload.reset_password_uri = reset_password_uri;
            var todays_datetime = new Date();
            payload.reset_request_time = todays_datetime.toString();
            LogInUtilities.resetPassword(payload, (confirmation) => {
                convertObjectToResponse(confirmation, res);
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

app.post('/read-card', requireLogIn, function(req, res) {
    CardsDB.read(req.body, function(card) {
        res.json(card);
    });
});

app.get('/home', requireLogIn, function(req, res) {
    res.render("pages/home.ejs");
});

app.post('/read-metadata', requireLogIn, function (req, res) {
    MetadataDB.read(req.body, function (metadata) {
        res.json(metadata);
    });
});

app.post('/tags', function (req, res) {
    MetadataDB.readTags(req.body, function (tags) {
        res.json(tags);
    });
});

app.post('/add-card', requireLogIn, function(req, res) {
    CardsDB.create(req.body, function(confirmation) {
        res.json(confirmation);
    });
});

app.post('/search-cards', requireLogIn, function(req, res) {
    var payload = req.body;
    payload.userIDInApp = req.session.user.userIDInApp;
    CardsDB.search(payload, (search_results) => {
        convertObjectToResponse(search_results, res);
    });
});

app.post('/update-card', requireLogIn, function(req, res) {
    CardsDB.update(req.body, function(confirmation) {
        res.json(confirmation);
    });
});

app.post('/delete-card', requireLogIn, function(req, res) {
    CardsDB.delete(req.body, function(confirmation) {
        res.json(confirmation);
    });
});

app.post('/trash-card', requireLogIn, function (req, res) {
    MetadataDB.send_to_trash(req.body, function (confirmation) {
        res.json(confirmation);
    });
});

app.post('/restore-from-trash', requireLogIn, function (req, res) {
    MetadataDB.restore_from_trash(req.body, function (confirmation) {
        res.json(confirmation);
    });
});

/**
 * @description A function to interpret JSON documents into server responses.
 * @param {JSON} result_JSON Expected keys: `status`, `success`, `message`
 * @param {Response} res An Express JS res object 
 */
convertObjectToResponse = function(result_JSON, res) {
    if (result_JSON.status < 400) {
        res.json(result_JSON);
    } else if (result_JSON.status >= 400 && result_JSON.status < 500) {
        res.render("pages/4xx_error_page.ejs", { response_JSON: result_JSON });
    } else {
        res.render("pages/5xx_error_page.ejs", { response_JSON: result_JSON });
    }
};

app.listen(port, function() {
    console.log(`App is running on port ${port}`);
});

/**
 * Setup default error catcher.
 */
app.use(function (error, req, res, next) {
    console.error(error.stack);
    res.render(
        "pages/4xx_error_page.ejs", 
        {response_JSON: {status: 404, message: "Page Not Found"}}
    );
});
