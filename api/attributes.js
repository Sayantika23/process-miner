var fs = require('fs');

module.exports = function (app) {
    app.get('/attributes', function (req, res) {
        fs.readdir('core/attributes', function (err, files) {
            if (err) {
                res.send(err);
            } else {
                res.send(files);
            }
        });
    });
};