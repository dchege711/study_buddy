var stanfordCrypto = require('sjcl');
var config = require("../config");
var User = require("./userSchema");
var mongoose = require('mongoose');

getSaltAndHash = function(password, callBack) {
    // 8 words = 32 bytes = 256 bits, a paranoia of 7
    var salt = stanfordCrypto.random.randomWords(8, 7);
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(salt, hash);
}

getHash = function(password, salt, callBack) {
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(hash);
}

getIdInApp = function(callBack) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        User.findById({_id: config.USER_METADATA_ID}, function(error, user) {
            if (error) {
                console.log(error);
            } else {
                var newUserID = user["idInApp"] + 1;
                user["idInApp"] = newUserID;
                user.save(function(error, confirmation) {
                    if (error) {
                        console.log(error);
                    } else {
                        mongoose.disconnect();
                        callBack(newUserID);
                    }
                });
            }
        });
    });
}

exports.registerUserAndPassword = function(payload, callBack) {
    var username = payload["username"];
    var password = payload["password"];
    var email = payload["email"];
    getSaltAndHash(password, function(salt, hash) {
        getIdInApp(function(userId) {
            var user = new User({
                username: username,
                salt: salt,
                hash: hash,
                idInApp: userId,
                email: email
            });
            console.log("Saving new user: " + email);
            mongoose.connect(config.MONGO_URI);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'Connection Error:'));
            db.once('open', function() {
                user.save(function(error, confirmation) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Account successfully created!");
                        callBack(confirmation);
                    }
                });
            });    
        });
    });
}

exports.authenticateUser = function(payload, callBack) {
    var username = payload["username"];
    var password = payload["password"];
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        User.findOne({ username: username}, function(error, user) {
            if (error) {
                console.log(error);
            } else {
                if (user === null) {
                    callBack("Fail");
                    return;
                }
                var saltOnFile = user["salt"];
                var hashOnFile = user["hash"];
                getHash(password, saltOnFile, function(calculatedHash) {
                    var thereIsAMatch = true;
                    for (let i = 0; i < calculatedHash.length; i++) {
                        if (calculatedHash[i] !== hashOnFile[i]) {
                            thereIsAMatch = false;
                            break;
                        } 
                    }
                    if (thereIsAMatch) {
                        callBack("Success");
                    } else {
                        callBack("Fail");
                    }
                });
            }
        });
    }); 
}
