(function (root) {
    root.selectedRepositories = [];

    function processLanguages(languages) {
        var total = 0;

        for (var key in languages) {
            total += languages[key];
        }

        for (var key in languages) {
            languages[key] = Math.round((languages[key] / total) * 100) + ' %';
        }

        return languages;
    }

    function showDetails(repo) {
        clearDetails();

        var commits_url = repo.commits_url.substring(0, repo.commits_url.indexOf("{"));
        var languages_url = repo.languages_url;

        $.get(commits_url, function (commits) {
            var commitsMessage = commits.map(function (commit) {
                return 'Commit by ' + commit.commit.author + ' : ' + commit.commit.message;
            });

            $('#commits').append('<p>' + commits.length + ' commits</p>');

            $.get(languages_url, function (languages) {
                $('#languages').append('<p>' + JSON.stringify(processLanguages(languages)) + '</p>');
            });
        });
    }

    function addRepos(repos, count) {
        $('#repositories').children().remove();

        $('.message h3').text('Found ' + count + ' repositories. Displaying top ' + repos.length + '.')
        for (var i = 0; i < repos.length; i++) {
            $('#repositories').append('<li><button>+</button><span>' + repos[i].url + '</span></li>');
        }
    }

    $('#search').click(function () {
        var query = $('#query').val();

        $.get('https://api.github.com/search/repositories?q=' + query + '&per_page=100', function (data) {
            console.log(data);

            addRepos(data.items, data.total_count);
        });
    });

    $('#repositories').click(function (e) {
        var repo = $(e.target).parent('li').find('span').text();

        if (!root.selectedRepositories.length) {
            $('#selected-repositories').children().remove();
        }

        root.getRepository(repo)
            .then(function (repository) {
                return repository.fetch('commits');
            })
            .then(function (repository) {
                return repository.fetch('issues');
            })
            .then(function (repository) {
                return repository.fetch('stargazers');
            }).then(function (repository) {
                return repository.fetch('languages');
            }).then(function (repository) {
                console.log('Repository', repository);
                var languages = repository.extracted_data.languages;
                var languageTotalLoc = 0;
                var languageDistribution = '';

                for (var key of Object.keys(languages)) {
                    languageTotalLoc += languages[key];
                }

                for (var key of Object.keys(languages)) {
                    languageDistribution += '<span class="language-stat">' + key + ' ' + (Math.round((languages[key] / languageTotalLoc) * 10000) / 100) + '% </span>';
                }

                $('#selected-repositories').append('<li><div class="language-stats">' + repo + '</span><br /><span>' + languageDistribution + '</div></li>');
                root.selectedRepositories.push(repository);
                console.log(repo, 'added');
            });

        console.log(repo, 'clicked');
    });
}(window.App = window.App || {}));