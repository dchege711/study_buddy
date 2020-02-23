/**
 * @description Tells the CLI how to connnect to the database.
 */

const DB_URI = require("../../dist/config.js").DATABASE_URI;

/**
 * Extract the components from the connection URI. The form is defined as below:
 * 
 * `postgresql://[user[:password]@][netloc][:port][,...][/dbname][?param1=value1&...]`
 * 
 * For our use case, we expect the string to be as follows:
 * 
 * `postgres://[user]:[password]@[host]:[port]/[dbname]`;
 * 
 * https://www.postgresql.org/docs/current/libpq-connect.html
 */
const DB_URI_REGEX = /postgres:\/\/(\w+):(\w+)@(\w+):(\d+)\/(\w+)/;
const uriComponents = DB_URI_REGEX.exec(DB_URI);

if (uriComponents.length !== 5) {
  throw new Error(`Expected 5 URI components, but received ${uriComponents}`);
}

let dbConnectionObject = {
  username: uriComponents[0],
  password: uriComponents[1],
  host: uriComponents[2],
  port: uriComponents[3],
  database: uriComponents[4],
  "dialect": "postgres",
};

/**
 * @description The keys of the objects, e.g. `development`, are used in
 * `model/index.js` for matching `process.env.NODE_ENV`.
 */
module.exports = {
    "development": dbConnectionObject,
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": dbConnectionObject
}