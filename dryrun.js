const Repository = require('./core/repository');
const ProcessMiner = require('./core/process-miner');

let repositories = [];

// ProcessMiner.process(['https://github.com/angular/angular'], ['stars', 'community', 'documentation', 'architecture'])
//     .then(repositories => {
//         console.log('\n');
//         console.log('=======');
//         console.log('RESULTS');
//         console.log('=======');
//         console.log('\n');
//         repositories = repositories.map(repo => { console.log(repo.url, JSON.stringify(repo)) });
//         console.log('\n');
//     })
//     .catch(error => console.log('ERROR', error));

var angular = new Repository('https://github.com/angular/angular');

angular.fetch()
    .then(() => angular.get('commits').catch(console.log))
    .then(() => angular.get('issues').catch(console.log))
    .then(() => angular.get('contents').catch(console.log))
    .catch(error => console.log('ERROR', error, angular.json()))
    .then(() => {
        console.log('Loaded Repo', angular.url)

        console.log('Passing angular to process miner');
        ProcessMiner.process([angular], ['continuous-integration', 'community', 'history', 'license', 'issues'])
            .then(repositories => {
                console.log('\n');
                console.log('=======');
                console.log('RESULTS');
                console.log('=======');
                console.log('\n');
                repositories = repositories.map(repo => { console.log(repo.url, JSON.stringify(repo.attribute_results, null, 4)) });
                console.log('\n');
            })
            .catch(error => console.log('ERROR', error));
    });