var AttributesRunner = require('./attributes-runner');
var Repository = require('./repository');

class ProcessMiner {
    static process(repositories, attributes) {
        const attributesRunner = new AttributesRunner(attributes);

        return Promise.all(repositories.map(repo => attributesRunner.run(repo)));

        // return new Promise((resolve, reject) => {
        // First map the URLs to the Github Repos.
        // var promises = [];

        // repositoryUrls.map(repositoryUrl => {
        //     const repository = new Repository(repositoryUrl);
        //     const fetchPromise = repository.fetch();

        //     promises.push(fetchPromise);

        //     repoCategoriesToLoad.forEach(category => {
        //         // repository.data.commits_url = 'asfaf';
        //         console.log('LOADING', category);
        //         fetchPromise.then(() => {
        //             console.log('Finished fetching repo')
        //         })
        //         fetchPromise.then(repository.get(category).catch(error => console.log('ERROR LOADING', category, error)));
        //     });
        // });
        // });
    }
}

module.exports = ProcessMiner;