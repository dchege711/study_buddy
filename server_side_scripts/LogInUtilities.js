var stanfordCrypto = require('sjcl');
var config = require("../config")

getSaltAndHash = function(password, callBack) {
    // 8 words = 32 bytes = 256 bits, a paranoia of 7
    var salt = stanfordCrypto.random.randomWords(8, 7);
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(salt, hash);
}

getIdInApp = function(callBack) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        User.find({_id: config.USER_METADATA_ID}, function(error, user) {
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
                    }
                });
                callBack(newUserID);
            }
        });
    });
}

exports.registerUserAndPassword = function(username, password, callBack) {
    getSaltAndHash(password, function(salt, hash) {
        getIdInApp(function(userId) {
            var user = new User({
                username: username,
                salt: salt,
                hash: hash,
                idInApp: userId,
            });
            
            mongoose.connect(config.MONGO_URI);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'Connection Error:'));
            db.once('open', function() {
                user.save(function(error, confirmation) {
                    if (error) {
                        console.log(error);
                    } else {
                        callBack(confirmation);
                    }
                });
            });    
        });
    });
}

exports.authenticatePassword = function(username, password, callBack) {
    mongoose.connect(config.MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', function() {
        User.find({ username: username}, function(error, user) {
            if (error) {
                console.log(error);
            } else {
                var saltOnFile = user["salt"];
                var hashOnFile = user["hash"];
                var calculatedHash = stanfordCrypto.misc.pbkdf2(password, saltOnFile);
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
            }
        });
    }); 
}

// var pw = "not-my-password";
// var pw2 = "not-really-my-password";
// getSaltAndHash(pw, function(salt, hash) {
//     authenticatePassword(pw, salt, hash, function(myHash, trueHash){
//         console.log(myHash);
//         console.log(trueHash);
//     });
//     // authenticatePassword(pw2, salt, hash);
// });
