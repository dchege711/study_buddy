var mongoose = require('mongoose');

var metadataSchema = new mongoose.Schema({
    node_information: mongoose.SchemaTypes.Mixed,
    stats: mongoose.SchemaTypes.Mixed,
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