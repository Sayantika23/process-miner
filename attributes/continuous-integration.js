module.exports = {
    toFetch() {
        return ['contents'];
    },
    run(repository) {
        const files = repository.extracted_data.contents;
        const ciServices = ['.travis.yml', '.circleci'];

        let continuous_integration = 0;
        let configFile = 'none';

        files.forEach(file => {
            if (ciServices.indexOf(file.name) !== -1) {
                continuous_integration = 1;
                configFile = file.name;
            }
        });

        return {
            continuous_integration: continuous_integration,
            config_file: configFile
        };
    }
};