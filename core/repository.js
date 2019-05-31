const fetch = require('axios');

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

class Repository {
    constructor(url) {
        this.url = url;
    }

    json() {
        return this;
    }

    mockFetch() {
        return new Promise(resolve => {
            const mockData = require('../mock/angular.json');
            this.data = mockData.data;
            this.extracted_data = mockData.extracted_data;

            resolve(this);
        });
    }

    fetch() {
        var searchString = 'github.com';
        var searchIncrement = 10;
        var url = this.url;
        this.data = {};

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
            this.data = repoData.data;

            return this;
        }).catch(error => {
            this.data = {
                loaded: false,
                error: error.message
            };

            return this;
        });
    }

    get(category) {
        // If there is no data, then fetch the data first.
        if (!this.data) {
            console.log('No Data Found', this);
            return this.fetch().then(this.get(category));
        }

        // Check the data for the URL of the chosen category.
        if (this.data[category + '_url']) {
            var url = this.data[category + '_url'];
            var paramsData = processParams(url.match(/{[a-zA-Z0-9\/-_]+}/g));

            paramsData.forEach(param => {
                param.value = this.data[param.name];
                return param;
            });

            url = replaceParams(url, paramsData);

            this.extracted_data = this.extracted_data || {};

            return fetch(url).then(data => {
                this.extracted_data[category] = data.data;
                return this;
            }).catch(error => {
                this.extracted_data[category] = { error }
                return error;
            }).finally(() => {
            });
        } else {
            // No URL found for the category.
            return Promise.reject('No URL found for category ' + category + '  ' + JSON.stringify(this.json()));
        }
    };
}

module.exports = Repository;