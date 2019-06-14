const fetch = require('axios');

class Repository {
    constructor(url) {
        this.url = url;
        this.data = {};
    }

    data() {
        return this.data;
    }

    mockFetch() {
        return new Promise(resolve => {
            const mockData = require('../mock/angular.js/index.js');
            this.data = mockData.data;
            this.extracted_data = mockData.extracted_data;

            resolve(this);
        });
    }

    fetch(category, loader) {
        if (!this.data) {
            console.log('No Data Found', this);
            return loader.fetch(this).then(loader.fetch(this, category));
        }

        return loader.fetch(this, category);
    }
}

module.exports = Repository;