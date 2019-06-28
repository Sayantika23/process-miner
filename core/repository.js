const fetch = require('axios');
const fs = require('fs');

class Repository {
    constructor(url) {
        this.url = url;
        this.data = null;
        this.extracted_data = null;
        this.attribute_results = null;
    }

    json() {
        return {
            url: this.url,
            data: this.data,
            extracted_data: this.extracted_data
        };
    }

    cacheIfRequired() {
        if (this.shouldCache) {
            this.saveToCache();
        }
    }

    loadFromCache() {
        const repoCacheFileName = repository.data.full_name.replace('/', '-'),
            fullPath = __dirname + '/../cache/' + repoCacheFileName + '.json';


        return require(fullPath);
    }

    saveToCache(overwriteData) {
        const repoCacheFileName = this.data.full_name.replace('/', '-'),
            fullPath = __dirname + '/../cache/' + repoCacheFileName + '.json';

        fs.writeFileSync(fullPath, JSON.stringify(overwriteData || this.json()));
        console.log('Successfully cached', this.url, 'at', fullPath);
    }

    fetch(category, loader) {
        if (!this.data) {
            // console.log('No Data Found. Loading Repo Data First for', this.url);
            return loader.fetch(this).then((data) => {
                this.data = data;

                if (this.shouldCache) {
                    this.cacheIfRequired();
                }

                return this.fetch(category, loader);
            });
        }

        return loader.fetch(this, category).then(categoryData => {
            this.extracted_data = this.extracted_data || {};
            this.extracted_data[category] = categoryData;

            if (this.shouldCache) {
                this.cacheIfRequired();
            }

            return this;
        });
    }
}

module.exports = Repository;