module.exports = {
    toFetch() {
        return ['contents'];
    },

    run: function (repository) {
        const files = repository.extracted_data.contents;
        const licenseFiles = ['LICENSE', 'COPYING', 'license', 'copying'];

        let license = 0;
        let license_file = 'none';

        files.forEach(file => {
            if (licenseFiles.indexOf(file.name) !== -1) {
                license = 1;
                license_file = file.name;
            }
        });

        return {
            license: license,
            license_file: license_file
        };
    }
};