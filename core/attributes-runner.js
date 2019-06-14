var Attribute = require('./attribute');

class AttributesRunner {
    constructor(attributes) {
        this.attributes = attributes.map(attribute => new Attribute(attribute));
    }

    getDependencies() {
        let repoCategoriesToLoad = [];

        this.attributes.forEach(attribute => {
            const toFetchForAttribute = attribute.toFetch();
            toFetchForAttribute.forEach(dep => {
                if (repoCategoriesToLoad.indexOf(dep) === -1) {
                    repoCategoriesToLoad.push(dep);
                }
            });
        });

        return repoCategoriesToLoad;
    }

    run(repository) {
        return new Promise((resolve, reject) => {
            const _run = (attributesToRun) => {
                if (!attributesToRun.length) {
                    return resolve(repository);
                }

                const attributeToRun = attributesToRun[0];

                console.log('\n[RUNNING', attributeToRun.name, ']');
                try {
                    attributeToRun.run(repository)
                        .then(data => {
                            console.log('Received Result from', attributeToRun.name, data);
                            repository.attribute_results = repository.attribute_results || {};
                            repository.attribute_results[attributeToRun.name] = data;

                            _run(attributesToRun.splice(1));
                        })
                        .catch(error => {
                            repository.attribute_results = repository.attribute_results || {};
                            repository.attribute_results[attributeToRun.name] = error;

                            _run(attributesToRun.splice(1));
                        });
                } catch (e) {
                    reject(e);
                }
            }

            // console.log('\n\n', 'Running Attributes on', repository.url, '\n', this.attributes, '\n\n');
            _run(this.attributes.slice(0));
        });
    }
}

module.exports = AttributesRunner;