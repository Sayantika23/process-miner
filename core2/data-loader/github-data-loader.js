const axios = require('axios'),
    DataLoader = require('./data-loader');

function processParams(params) {
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

function replaceParams(text, paramsData) {
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

function _fetch(repository) {
    let searchString = 'github.com',
        searchIncrement = 10,
        url = repository.url;

    repository.data = {};

    if (url.indexOf('api.github.com/repos') !== -1) {
        searchString = 'github.com/repos';
        searchIncrement = 16;
    }
    var fetchUrl = 'https://api.github.com/repos/' + url.substring(url.indexOf(searchString) + searchIncrement + 1);

    return fetch.get(fetchUrl, {
        headers: {
            'User-Agent': 'request'
        }
    }).then(repoData => {
        repository.data = repoData.data;

        return repository;
    }).catch(error => {
        repository.data = {
            loaded: false,
            error: error.message
        };

        return repository;
    });
}

class GithubDataLoader extends DataLoader {
    fetch(repository, category) {
        // If there is no data, then fetch the data first.
        if (!repository.data) {
            console.log('No Data Found', this);
            return _fetch(repository).then(this.fetch(repository, category));
        }

        // Check the data for the URL of the chosen category.
        if (repository.data[category + '_url']) {
            var url = this.data[category + '_url'];
            var paramsData = processParams(url.match(/{[a-zA-Z0-9\/-_]+}/g));

            paramsData.forEach(param => {
                param.value = this.data[param.name];
                return param;
            });

            url = replaceParams(url, paramsData);

            this.extracted_data = this.extracted_data || {};

            return axios(url).then(data => {
                this.extracted_data[category] = data.data;
                return this;
            }).catch(error => {
                console.log("Error", error);
                this.extracted_data[category] = { error }
                return error;
            }).finally(() => {
            });
        } else {
            // No URL found for the category.
            return Promise.reject('No URL found for category ' + category + '  ' + JSON.stringify(this.json()));
        }
    }
}

module.exports = GithubDataLoader;