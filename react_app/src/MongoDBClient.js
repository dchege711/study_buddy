const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const assert = require('assert');

const databaseName = 'c13u_study_buddy';
const url = config.MONGO_URI;


const db = MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

console.log(db);

var Collection = {
    
    collection: db.collection('dummy_collection'),
    
    collectionName: function(name) {
        this.collection = db.collection(name);
    },
    
    create: function(data, callBack) {
        this.collection.insertOne(data, function(error, response) {
            if (error) {
                callBack(error);
                return;
            }
            assert.equal(1, response.insertedCount);
            this.read(response.insertedId);
        });
    },
    
    read: function(id, callBack) {
        this.collection.find({
            "_id": id
        }).limit(1).toArray(function(error, doc) {
            assert.equal(null, error);
        });
    },
    
    update: function(id, data, callBack) {
        return null
    },
    
    _delete: function(id, callBack) {
        return null;
    }
};

module.exports = {
    Collection: Collection
}
