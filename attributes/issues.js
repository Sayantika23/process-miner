module.exports = {
    toFetch() {
        return ['issues'];
    },
    run: function (repository) {
        const issueDates = repository.extracted_data.issues.map(issue => new Date(issue.created_at).getTime()).sort();

        let issue_frequency = 0;
        let issues_by_month = {};
        let numberOfMonths = 0;

        if (issueDates.length < 2) {
            issue_frequency = issueDates.length;
        } else {
            for (var i = 0; i < issueDates.length; i++) {
                let commitDate = new Date(issueDates[i]);
                let key = commitDate.getMonth() + ',' + commitDate.getFullYear();

                issues_by_month[key] = issues_by_month[key] || 0;
                issues_by_month[key]++;
            }

            for (var month in issues_by_month) {
                numberOfMonths++;
                issue_frequency += issues_by_month[month];
            }

            issue_frequency /= numberOfMonths;
        }

        return {
            issue_frequency: issue_frequency,
            issues_by_month: issues_by_month
        };
    }
};