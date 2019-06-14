// const Repository = require('./core/repository'),
//     ProcessMiner = require('./core/process-miner'),
//     fs = require('fs');

// let repositories = [];

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

// var angular = new Repository('https://github.com/angular/angular');

// angular.mockFetch()
// .then(() => angular.get('commits').catch(console.log))
// .then(() => angular.get('issues').catch(console.log))
// .then(() => angular.get('contents').catch(console.log))
// .catch(error => console.log('ERROR', error))
// .then(() => {
//     console.log('Loaded Repo', angular.url);

//     ProcessMiner.process([angular], ['continuous-integration', 'community', 'history', 'license', 'issues'])
//         .then(repositories => {
//             console.log('\n');
//             console.log('=======');
//             console.log('RESULTS');
//             console.log('=======');
//             console.log('\n');
//             repositories = repositories.map(repo => { console.log(repo.url, JSON.stringify(repo, null, 4)) });
//             console.log('\n');
//         })
//         .catch(error => console.log('ERROR', error));
// });



// const repoListFile = './repos.txt', repos = [];

// fs.readFile(repoListFile, (err, data) => {
//     const repoUrls = data.toString().split('\n');

//     console.log('Loading', repoUrls.length, 'repos');

//     repoUrls.forEach(repoUrl => {
//         repos.push(new Repository(repoUrl));
//     });

//     console.log('Repos', repos);
// });

const SessionLoader = require('./core2/session-loader'),
    ProcessMiner = require('./core2/process-miner');

const session = SessionLoader.load('../session.config.js');

ProcessMiner.run(session); 