var stanfordCrypto = require('sjcl');

getSaltAndHash = function(password, callBack) {
    // 8 words = 32 bytes = 256 bits, a paranoia of 7
    var salt = stanfordCrypto.random.randomWords(8, 7);
    var hash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(salt, hash);
}

authenticatePassword = function(password, salt, hash, callBack) {
    var calculatedHash = stanfordCrypto.misc.pbkdf2(password, salt);
    callBack(calculatedHash, hash);
}

var pw = "not-my-password";
var pw2 = "not-really-my-password";
getSaltAndHash(pw, function(salt, hash) {
    authenticatePassword(pw, salt, hash, function(myHash, trueHash){
        console.log(myHash);
        console.log(trueHash);
    });
    // authenticatePassword(pw2, salt, hash);
});
