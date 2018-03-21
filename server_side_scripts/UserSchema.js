/**
 * @description Prepare a model for representing users in the database.
 * 
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: [true, "This username is already taken"],
        },
        salt: Array,
        hash: Array,
        userIDInApp: {
            type: Number,
            unique: true
        },
        email: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true,
        autoIndex: false,
        collection: "study_buddy_users"
    }
);

module.exports = mongoose.model('User', userSchema);
