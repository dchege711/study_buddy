var mongoose = require('mongoose');

var metadataSchema = new mongoose.Schema({
    title: String,
    node_information: Array,
    link_information: Array,
    description: String,
    stats: Array,
    createdById: Number
},
    {
        timestamps: true,
        autoIndex: false,
        collection: "c13u_study_buddy"
    }
);

module.exports = mongoose.model('Metadata', metadataSchema);