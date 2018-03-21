var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        username: String,
        salt: Array,
        hash: Array,
        userIDInApp: Number,
        email: String
    },
    {
        timestamps: true,
        autoIndex: false,
        collection: "study_buddy_users"
    }
);

module.exports = mongoose.model('User', userSchema);
