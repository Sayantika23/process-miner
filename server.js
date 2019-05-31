var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: 100000000 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./api/index')(app);
require('./ui/index')(app);

module.exports = {
    start: function () {
        app.listen(9000, function () {
            console.log('Application running on http://localhost:9000');
        });
    }
};