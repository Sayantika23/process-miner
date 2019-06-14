const DataLoader = require('./data-loader');

class CacheDataLoader extends DataLoader {
    fetch(repository, category) {
        return Promise.resolve(require('../../mock/angular'));
    }
}

module.exports = CacheDataLoader;