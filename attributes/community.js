module.exports = {
    toFetch() {
        return ['commits'];
    },
    run: function (repository) {
        const authors = repository.extracted_data.commits.map(commit => commit.commit.author);
        let authorCount = [];
        let eightyPercentAcc = 0;
        let n = 0;
        let percent = 0;

        authors.forEach(author => {
            let existing = authorCount.find(_author => _author.email === author.email);

            if (!existing) {
                existing = author;
                existing.count = 1;
                authorCount.push(existing);
            } else {
                existing.count = existing.count || 0;
                existing.count++;
            }
        });

        authorCount.sort((a1, a2) => {
            return a2.count - a1.count;
        });

        // First calculate the total number of commits.
        const totalCommits = authorCount.reduce((prev, curr) => (prev.count || prev) + curr.count);

        authorCount.forEach(author => {
            if (eightyPercentAcc / totalCommits >= 0.8) {
                percent = eightyPercentAcc / totalCommits;
            } else {
                eightyPercentAcc += author.count;
                n++;
            }
        });

        return {
            core_contributors: n,
            percentage_of_commits_by_core_contributors: percent
        };
    }
};