class Session {
    getRepositories() {
        return this.repositories;
    }

    getAttributes() {
        return this.attributes;
    }

    getDataLoader() {
        return this.dataLoader;
    }

    static create(repositories, attributes, DataLoader) {
        let s = new Session();
        s.repositories = repositories;
        s.attributes = attributes;
        s.dataLoader = new DataLoader();

        return s;
    }
}

module.exports = Session;