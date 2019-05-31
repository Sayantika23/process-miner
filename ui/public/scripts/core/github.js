(function (root) {
    root.github = function (pageSize) {
        function invoke(url) {
            var page = 1;

            // Actually invoke the URL here and return the JSON response.
            return fetch(url + '?per_page=' + (pageSize || 100) + '&page=' + page, {
                headers: {
                    // 'Access-Control-Allow-Origin': true
                }
            }).then(function (response) {
                var responseData = response.json();

                responseData.nextPage = function (pageNumber) {
                    return fetch(url + '?per_page=' + (pageSize || 100) + '&page=' + (pageNumber || (++page))).then(function (response) {
                        return response.json();
                    });
                };

                return responseData;
            });
        }

        function get(category, repoUrl) {
            return Promise.resolve();
        }

        return {
            invoke: invoke,
            get: get
        };
    }(30);
}(window.App = window.App || {}));