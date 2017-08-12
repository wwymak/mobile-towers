'use strict';


const express = require("express");
const http = require('http');
// Setup server
const app = express();
const server = http.createServer(app);
require('./routes')(app);

app.set('port', (process.env.PORT || 3000));


function startServer() {
    server.listen(app.get('port'), () => {
        console.log('Express server listening on %d', app.get('port'));
    });
}

setImmediate(startServer);
