module.exports = {
    toFetch() {
        return ['commits'];
    },
    run(repository) {
        const commitDates = repository.extracted_data.commits.map(commit => new Date(commit.commit.author.date).getTime()).sort();

        let commit_frequency = 0;
        let commitsPerMonth = {};
        let numberOfMonths = 0;

        if (commitDates.length < 2) {
            commit_frequency = commitDates.length;
        } else {
            for (var i = 0; i < commitDates.length; i++) {
                let commitDate = new Date(commitDates[i]);
                let key = commitDate.getMonth() + ',' + commitDate.getFullYear();

                commitsPerMonth[key] = commitsPerMonth[key] || 0;
                commitsPerMonth[key]++;
            }

            for (var month in commitsPerMonth) {
                numberOfMonths++;
                commit_frequency += commitsPerMonth[month];
            }

            commit_frequency /= numberOfMonths;
        }

        return {
            commit_frequency: commit_frequency,
            commitsPerMonth: commitsPerMonth
        };
    }
}