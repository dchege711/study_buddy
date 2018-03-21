var mongoose = require('mongoose');

var metadataSchema = new mongoose.Schema({
    title: String,
    node_information: Array,
    description: String,
    stats: Array,
    createdById: Number,
    metadataIndex: Number,
},
    {
        timestamps: true,
        autoIndex: false,
        collection: "c13u_study_buddy_metadata"
    }
);

module.exports = mongoose.model('Metadata', metadataSchema);