module.exports = {
    toFetch() {
        return ['commits', 'issues'];
    },
    run: function (repository) {
        var threshold = 3;
        var bresult;

        if (repository.stargazers_count && repository.stargazers_count >= threshold)
            bresult = true;
        bresult = false;

        return {
            bresult: bresult,
            count: repository.stargazers_count || -1
        }
    }
};