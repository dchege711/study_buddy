'use strict';

// Credits to https://github.com/GoogleCloudPlatform/nodejs-getting-started/

import React from 'react';
import ReactDOM from 'react-dom';

const extend = require('lodash').assign;
const mysql = require('mysql');
const config = require('../config');
const databaseName = 'c13u_study_buddy'

const options = {
    user: config.get('MYSQL_USER'),
    password: config.get('MYSQL_PASSWORD'),
    database: databaseName
};

options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
const connection = mysql.createConnection(options);

function create(data, callBack) {
    connection.query('INSERT INTO `databaseName` SET ?', data, (error, response) => {
        if (error) {
            callBack(error);
            return;
        }
        read(response.insertId, callBack);
    });
}

function read(id, callBack) {
    connection.query('SELECT * FROM `databaseName` WHERE `id` = ?', id, (error, results) => {
        if (!error && !results.length) {
            error = {
                code: 404,
                message: 'Not found'
            };
        }
        if (error) {
            callBack(error);
            return;
        }
        callBack(null, results[0]);
    });
}

function update(id, data, callBack) {
    connection.query('UPDATE `databaseName` SET ? WHERE `id` = ?', [data, id], (error) => {
        if (error) {
            callBack(error);
            return;
        }
        read(id, callBack);
    });
}

function _delete(id, callBack) {
    connection.query('DELETE FROM `databaseName` WHERE `id` = ?', id, callBack);
}

function createSchema(config) {
    const connection = mysql.createConnection(extend({
        multipleStatments: true
    }, config));
    
    connection.query(
        `CREATE DATABASE IF NOT EXISTS \`databaseName\`
            DEFAULT CHARACTER SET = 'utf8'
            DEFAULT COLLATE 'utf8_general_ci';
        USE \`databaseName\`;
        CREATE TABLE IF NOT EXISTS \`databaseName\`.\`c13u_content\`(
            \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            \`title\` VARCHAR(255) NULL,
            \`description\` TEXT NULL,
            \`addDate\` VARCHAR(255) NULL,
            \`createdBy\` VARCHAR(255) NULL,
            \`createdById\` VARCHAR(255) NULL,
            \`lastReviewed\` VARCHAR(255) NULL,
            PRIMARY KEY (\`id\`));`,
        (error) => {
            if (error) {
                throw error;
            }
            console.log('Successfully created schema');
            connection.end();
        }
    );
}

if (module === require.main) {
    const prompt = require('prompt');
    prompt.start();
    
    console.log(`Running this script instantiates your mysql database, 
        but this script will not modify any existing tables`);
    
    prompt.get(['user', 'password'], (error, result) => {
        if (error) {
            return;
        }
        createSchema(result);
    });
}

module.exports = {
    createSchema: createSchema,
    create: create,
    read: read,
    update: update,
    delete: _delete
}
