function load(loader, repository, dependencies) {
    if (dependencies.length === 0) {
        return Promise.resolve(repository);
    }

    const dependency = dependencies.shift();

    return repository.fetch(dependency, loader).then(() => {
        return load(loader, repository, dependencies)
    });
}

function runAttributes(repository, attributes) {
    if (attributes.length === 0)
        return Promise.resolve(repository);

    const attribute = attributes.shift();

    return attribute.run(repository).then(attributeResult => {
        repository.attribute_results = repository.attribute_results || {};
        repository.attribute_results[attribute.name] = attributeResult;
        return runAttributes(repository, attributes.slice(0))
    });
}

function processRepositories(repositories, attributes, processedRepos) {
    if (repositories.length === 0)
        return Promise.resolve(processedRepos);

    const repository = repositories.shift();

    return runAttributes(repository, attributes.slice(0).reverse()).then(() => {
        processedRepos.push(repository);
        return processRepositories(repositories.slice(0), attributes, processedRepos);
    });
}

class ProcessMiner {
    static run(session) {
        // First load the repository data.
        let attributesToFetch = session.getAttributes().map(attribute => attribute.toFetch()),
            dependencies = [];

        if (attributesToFetch.length > 1) {
            dependencies = attributesToFetch.reduce((prev, current) => prev.concat(current));
        } else if (attributesToFetch.length === 1) {
            dependencies = attributesToFetch[0];
        }

        // Filter out redundancies to load a dependency only once across all attributes.
        dependencies = dependencies.filter((dep, index) => dependencies.indexOf(dep) === index);

        const promises = [];

        session.getRepositories().forEach(repository => {
            promises.push(load(session.getDataLoader(), repository, dependencies.slice(0)));
        });

        return Promise.all(promises).then(() => {
            // console.log(JSON.stringify(session.getRepositories()));
            return processRepositories(session.getRepositories(), session.getAttributes().reverse().slice(0), []);
        }).catch(err => {
            console.log('ERROR CAUGHT IN PROCESS MINER CLASS', '[', err, ']');
        });
    }
}

module.exports = ProcessMiner;