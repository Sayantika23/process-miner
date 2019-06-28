const DataLoader = require('./data-loader');

class CacheDataLoader extends DataLoader {
    fetch(repository, category) {
        const cachedFileName = repository.url.substring(repository.url.indexOf('github.com/') + 11).replace('/', '-') + '.json';

        const repo = require('../../cache/' + cachedFileName);

        if (!category) {
            return Promise.resolve(repo);
        } else {
            return Promise.resolve(repo.extracted_data[category]);
        }
    }
}

module.exports = CacheDataLoader;