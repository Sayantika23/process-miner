var RepositoryMiner = require('../core/repository-miner');
var github = require('../core/github');

module.exports = function (app) {
    app.post('/run', function (req, res) {
        new RepositoryMiner(req.body.repositories, req.body.attributes).run().then(function (data) {
            res.send(data);
        });
    });

    app.get('/github', function (req, res) {
        return github.invoke();
    });
};