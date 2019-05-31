module.exports = function (app) {
    require('./attributes')(app);
    require('./repository-miner')(app);
};