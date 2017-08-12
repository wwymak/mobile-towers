'use strict';

/**
 * Main application routes
 */

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
global.__base = __dirname + '/';

module.exports = function (app) {

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // Api Routes
    app.use('/api/get-towers', require('./api/getTowersInfo'));
    app.use('/api/get-carriers-count', require('./api/getCarriersInfo'));
    app.use(express.static('public'));

    // All other routes should redirect to the index.html
    app.route('/')
        .get((req, res) => {
            res.sendFile(__base + 'public/index.html')
        });

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });
};
