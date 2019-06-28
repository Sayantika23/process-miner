module.exports = {
    toFetch() {
        return [];
    },

    run: function (repository) {
        var threshold = 3;
        var bresult;

        if (repository.data.stargazers_count && repository.data.stargazers_count >= threshold)
            bresult = true;
        bresult = false;

        return {
            bresult: bresult,
            count: repository.data.stargazers_count || -1
        }
    }
};