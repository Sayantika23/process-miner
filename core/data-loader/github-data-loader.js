const axios = require('axios'),
    DataLoader = require('./data-loader'),
    shelljs = require('shelljs'),
    fs = require('fs');

function getLocData(repository) {
    return new Promise((resolve, reject) => {
        let loc = "";
        const child = shelljs.exec('./scripts/cloc-git.sh ' + repository.url + ' ' + repository.data.full_name.replace('\\', '-'), 
        { 
            async: true,
            shell: 'C:\\Program Files\\Git\\git-bash.exe'
        });
        child.stdout.on('data', (data) => {
            console.log('[NEW DATA]', data);
            loc += data;
        });

        child.stdout.on('end', () => {
            console.log('LOC>>>>>>>>>>', loc);
            const lines = loc.split('\n'),
                sumLine = lines[lines.length - 3].split(' ').filter(str => str.trim() !== '' && str.trim() !== 'SUM:');

            resolve({
                numberOfFiles: +sumLine[0],
                blankLines: +sumLine[1],
                commentLines: +sumLine[2],
                codeLines: +sumLine[3]
            });
        });
    });
}

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

        if (actualParam.charAt(0) === '/' || actualParam.charAt(0) === '+') {
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

    if (url.indexOf('api.github.com/repos') !== -1) {
        searchString = 'github.com/repos';
        searchIncrement = 16;
    }
    var fetchUrl = 'https://api.github.com/repos/' + url.substring(url.indexOf(searchString) + searchIncrement + 1);

    console.log('[HTTP Request]', fetchUrl);
    return axios.get(fetchUrl, {
        headers: {
            'User-Agent': 'request'
        }
    }).then(response => {
        return response.data;
    });
}

class GithubDataLoader extends DataLoader {
    fetch(repository, category) {
        repository.shouldCache = true;

        console.log('\nFetching', category, 'for', repository.url);
        // If there is no data, then fetch the data first.
        if (!category) {
            return _fetch(repository);
        }

        if (category === 'loc') {
            return getLocData(repository);
        }

        // Check the data for the URL of the chosen category.
        if (repository.data[category + '_url']) {
            var url = repository.data[category + '_url'];
            var paramsData = processParams(url.match(/{[a-zA-Z0-9\/-_+]+}/g));

            paramsData.forEach(param => {
                param.value = repository.data[param.name];
                return param;
            });

            url = replaceParams(url, paramsData);

            repository.extracted_data = repository.extracted_data || {};

            if (url.charAt(url.length - 1) === '/') {
                url = url.substring(0, url.length - 1);
            }
            console.log('[HTTP Request]', url);
            return axios(url).then(data => {
                return data.data;
            }).catch(error => {
                console.log('Error Caught in [HTTP Request]', url);
                // repository.extracted_data[category] = { error }
                return error;
            });
        } else {
            // No URL found for the category.
            return Promise.reject('No URL found for category [' + category + '] for ' + repository.url);
        }
    }
}

module.exports = GithubDataLoader;