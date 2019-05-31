const path = require('path');

class Attribute {
    constructor(name) {
        this.name = name;
        this.attributeRef = null;

        this.fetchAttribute();
    }

    toFetch() {
        if (this.attributeRef.toFetch) {
            return this.attributeRef.toFetch();
        }

        return [];
    }

    fetchAttribute() {
        if (!this.attributeRef) {
            this.attributeRef = require(path.join('..', 'attributes', this.name));
        }
    }

    run(repository) {
        if (!this.attributeRef) {
            this.fetchAttribute();
        }

        return new Promise((resolve, reject) => {
            if (this.attributeRef == null) {
                reject('Cannot run attribute');
            } else {
                if (this.attributeRef.init && this.attributeRef.init.constructor === Function) {
                    this.attributeRef.init();
                }

                if (this.attributeRef.run && this.attributeRef.run.constructor === Function) {
                    var result = this.attributeRef.run(repository);

                    if (result.then) {
                        result.then(resolve).catch(reject);
                    } else {
                        resolve(result);
                    }
                } else {
                    reject('Attribute named ' + this.name + ' does not have a run method to process the repository.');
                }
            }
        });
    }
}

module.exports = Attribute;