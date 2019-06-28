const SessionLoader = require('./core/session-loader'),
    ProcessMiner = require('./core/process-miner'),
    session = SessionLoader.load(__dirname + '/sessions/team-oreo-session.config.js');

try {
    ProcessMiner.run(session).then(results => {
        results.forEach(repo => {
            console.log('\n-----------------------------------------------------------------');
            console.log('REPOSITORY = ', repo.url, '\n');
            console.log(JSON.stringify(repo.attribute_results, null, 4));
        });
    });
} catch (e) {
    console.log('ERROR OCCURED IN MAIN', e);
}