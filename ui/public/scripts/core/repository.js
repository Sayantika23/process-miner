(function (root) {
    var github = root.github;

    function Repository(url) {
        var repository = {
            data: null,
            url: url
        };

        function _fetchRepo() {
            var searchString = 'github.com';
            var searchIncrement = 10;

            if (url.indexOf('api.github.com/repos') !== -1) {
                searchString = 'github.com/repos';
                searchIncrement = 16;
            }
            var fetchUrl = 'https://api.github.com/repos/' + url.substring(url.indexOf(searchString) + searchIncrement + 1);

            return github.invoke(fetchUrl).then(function (repoData) {
                repository.data = repoData;

                return repository;
            });
        }

        function _processParams(params) {
            if (!params) {
                return [];
            }

            return params.map(function (param) {
                var actualParam = param.substring(1, param.length - 1);
                var paramsData = {
                    name: actualParam,
                    required: true,
                    replaceText: param
                };

                if (actualParam.charAt(0) === '/') {
                    paramsData.name = paramsData.name.substring(1);
                    paramsData.required = false;
                }

                return paramsData;
            });
        }

        function _replaceParams(text, paramsData) {
            paramsData.forEach(function (param) {
                if (param.required) {
                    if (!param.value) {
                        throw 'Please provide a value for ' + param.name;
                    } else {
                        param.value = '/' + param.value;
                    }
                } else {
                    if (!param.value) {
                        param.value = '';
                    }
                }

                text = text.replace(param.replaceText, param.value);
            });

            return text;
        }

        function fetch(category) {
            var promises = [];

            // Invoke the github API for this repository.
            if (!repository.data) {
                promises.push(_fetchRepo());
            }

            if (repository.data[category + '_url']) {
                var url = repository.data[category + '_url'];
                var paramsData = _processParams(url.match(/{[a-zA-Z0-9\/-_]+}/g));

                paramsData.forEach(function (param) {
                    param.value = repository.data[param.name];
                    return param;
                });

                url = _replaceParams(url, paramsData);

                promises.push(github.invoke(url).then(function (data) {
                    repository['extracted_data'] = repository['extracted_data'] || {};
                    repository['extracted_data'][category] = data;
                    return repository;
                }));
            }

            // return Promise.all(promises);

            return github.invoke(url).then(function (data) {
                repository['extracted_data'] = repository['extracted_data'] || {};
                repository['extracted_data'][category] = data;
                return repository;
            });
        };

        repository.fetch = fetch;
        repository._fetchRepo = _fetchRepo;
        return repository;
    };

    root.getRepository = function (url) {
        return new Repository(url)._fetchRepo();
    };
}(window.App = window.App || {}));