/**
 * @description Prepare a model for representing users in the database.
 * 
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
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
            required: true,
            unique: true
        }
    },
    {
        timestamps: true,
        autoIndex: false,
        collection: "study_buddy_users"
    }
);

userSchema.virtual("url").get(function() {
    return "/study-buddy/user/" + this._id;
});

module.exports = mongoose.model('User', userSchema);
