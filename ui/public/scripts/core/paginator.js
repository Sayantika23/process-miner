(function (root) {
    function mixin(dest, src) {
        for (var key in src) {
            dest[key] = src[key];
        }
    }

    root.ConnectedNode = function (url, operatorsList) {
        var node = {
            data: null
        };

        for (var i = 0; i < operatorsList.length; i++) {
            // Initialize the operator.
            operatorsList[i] = operatorsList[i](node);
        }

        node._invoke = function () {
            var processedUrl = url;

            for (var i = 0; i < operatorsList.length; i++) {
                processedUrl = operatorsList[i].processUrl(processedUrl);
            }

            return fetch(processedUrl).then(function (response) {
                return response.json();
            });
        }

        node.getData = function () {
            return node._invoke.then(function (data) {
                node.data = data;
            });
        }

        for (var i = 0; i < operatorsList.length; i++) {
            // Mixin the operations.
            mixin(node, operatorsList[i].getOperations());
        }

        return node;
    }

    root.NodeAddons = {
        NodePaginator: function (pageSize, start) {
            return function (node) {
                pageSize = pageSize || 100;
                start = +start || 1;

                return {
                    processUrl: function (url) {
                        return url + '?per_page=' + pageSize + '&&page=' + (start++);
                    },
                    getOperations: function () {
                        return {
                            getData: function () { throw 'Please call nextPage() operation'; },
                            nextPage: function () {
                                return node._invoke().then(function (data) {
                                    node.data = node.data || [];
                                    node.data = node.data.concat(data || []);
                                });
                            }
                        }
                    }
                };
            };
        }
    };

    // var node = new ConnectedNode('http://example.com', [NodePaginator(100, 1)]);

    // node.nextPage();
}(window.App = window.App || {}));