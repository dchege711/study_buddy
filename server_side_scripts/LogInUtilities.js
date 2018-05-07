var stanfordCrypto = require('sjcl');
var config = require("../config");
var User = require("./models/UserSchema");
var MetadataDB = require("./MetadataMongoDB");
var mongoose = require('mongoose');

var debug = false;

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

/**
 * @description Generate a random User ID and make sure it is unique
 * in the database.
 */
getIdInApp = function(callBack) {
    var randomID = Math.floor(Math.random() * 100000000000);
    User.findOne({userIDInApp: randomID}, function(error, user) {
        if (error) {
            console.log(error);
        }
        if (user === null) {
            callBack(randomID);
        } else {
            getIdInApp(callBack);
            return;
        }
    });
}

/**
 * Register a new user using the provided password.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Function that takes a JSON param w/ `success`, 
 * `internal_error` and `message` as keys. 
 */
exports.registerUserAndPassword = function(payload, callBack) {
    var username = payload["username"];
    var password = payload["password"];
    var email = payload["email"];

    // Apologies for the nesting nightmare below
    // Be the change that you wish to see in the world ;-)

    getSaltAndHash(password, function(salt, hash) {
        getIdInApp(function(userId) {
            var user = new User({
                username: username,
                salt: salt,
                hash: hash,
                userIDInApp: userId,
                email: email
            });

            if (debug) console.log("Saving new user: " + email);
            User.findOne({ email: user.email }, (error, existingUser) => {
                if (error) {
                    callBack({
                        "success": false,
                        "internal_error": true,
                        "message": error
                    });        
                    return;
                } else {
                    // Check what mongoose returns if a document doesn't exist. Ans: []
                    if (existingUser) {
                        // Send an email to them notifying them of suspicious activity            
                        return;
                    } else {
                        // Save the new user's account and send enough info to log them in
                        user.save(function (error, savedUser) {
                            if (error) {
                                callBack({
                                    "success": false, "internal_error": true, "message": error
                                });                   
                            } else {
                                MetadataDB.create({
                                    userIDInApp: savedUser.userIDInApp,
                                    metadataIndex: 0
                                }, callBack);
                            }
                        });
                    }
                }
            });
        });    
    });
}

/**
 * Authenticate a user that is trying to log in.
 * 
 * @param {JSON} payload Expected keys: `username`, `password`
 * @param {function} callBack Accepts JSON param w/ `success`, `internal_error`
 *  and `message` as keys
 */
exports.authenticateUser = function(payload, callBack) {

    var username = payload["username"];
    var password = payload["password"];

    User.findOne({ username: username}, function(error, user) {
        if (error) {
            console.log(error);
        } else {
            // Case 1: The user doesn't exist
            if (!user) {
                callBack({
                    "success": false, "internal_error": false,
                    "message": "Incorrect username and/or password"
                });   
                return;
            }

            // Otherwise try authenticating the user
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

                // Case 2: The user has provided correct credentials
                if (thereIsAMatch) {
                    MetadataDB.read({ userIDInApp: user.userIDInApp}, callBack);        
                    return;
                } else {
                    // Case 3: The user provided wrong credentials
                    callBack({
                        "success": false, "internal_error": false,
                        "message": "Incorrect username and/or password"
                    });
                    return;
                }
            });
        }
    });
}
