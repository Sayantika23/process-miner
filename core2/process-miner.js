function load(loader, repository, dependencies) {
    if (dependencies.length === 0)
        return repository;

    const dependency = dependencies.shift();
    console.log('Loading', dependency, 'for', repository);
    return repository.fetch(dependency, loader)
        .then(repository.fetch(dependencies, loader));
}

function runAttributes(repository, attributes) {
    if (attributes.length === 0)
        return Promise.resolve(repository);

    const attribute = attributes.shift();

    console.log('Processing Attribute', JSON.stringify(attribute, 2));
    return attribute.run(repository).then(runAttributes(repository, attributes.slice(0)));
}

function processRepositories(repositories, attributes, processedRepos) {
    console.log('PROCESSED REPOS', processedRepos);
    if (repositories.length === 0)
        return Promise.resolve(processedRepos);

    const repository = repositories.shift();

    console.log('Processing Repository', repository, processedRepos);
    processedRepos.push(repository);
    return runAttributes(repository, attributes.slice(0).reverse()).then(processRepositories(repositories.slice(0), attributes, processedRepos));
}

class ProcessMiner {
    static run(session) {
        console.log('Running Session', session);

        // First load the repository data.
        let dependencies = session.getAttributes().map(attribute => attribute.toFetch()).reduce((prev, current) => prev.concat(current));
        dependencies = dependencies.filter((dep, index) => dependencies.indexOf(dep) === index);

        const promises = [];

        session.getRepositories().forEach(repository => {
            promises.push(load(session.getDataLoader(), repository, dependencies.slice(0)));
        });

        return Promise.all(promises).then(processRepositories(session.getRepositories().slice(0), session.getAttributes().slice(0), []));
    }
}

module.exports = ProcessMiner;