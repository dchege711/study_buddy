var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    salt: Array,
    hash: Array,
    idInApp: Number,
    {
        timestamps: true,
        autoIndex: false,
        collection: "study_buddy_users"
    }
);

module.exports = mongoose.model('User', userSchema);
