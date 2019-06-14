const Attribute = require('./attribute'),
    Repository = require('./repository'),
    Session = require('./session'),
    GithubDataLoader = require('./data-loader/github-data-loader'),
    CacheDataLoader = require('./data-loader/cache-data-loader');

function getDataLoader(name) {
    switch (name) {
        case 'github':
            return GithubDataLoader;

        case 'cache':
            return CacheDataLoader;
    }
}

class SessionLoader {
    static load(sessionFile) {
        const session = require(sessionFile);

        console.log('LOADED', session);

        return Session.create(
            session.repositories.map(url => new Repository(url)),
            session.attributes.map(name => new Attribute(name)),
            getDataLoader(session.loader)
        );
    }
}

module.exports = SessionLoader;