const dbClient = require('./MongoDBClient');

const myCollection = dbClient.Collection;

item = {
    "key_1": "Please make it to Heroku"
}
myCollection.create(item, {});
