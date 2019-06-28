(function (root) {
    var Repository = root.Repository;

    $.get('/attributes', function (data) {
        data.map(function (attr) {
            var $attr = $('<li />');
            $attr.append('<input type=checkbox />');
            $attr.append('<span>' + attr + '</span>');

            $('#attributes').append($attr);
        });
    });

    $('#process-repositories').click(function () {
        var repositories = [];
        var attributes = [];

        $('#repositories').children().find('input:checked').parent().find('span').each(function (index, repo) {
            repositories.push($(repo).text());
        });

        $('#attributes').children().find('input:checked').parent().find('span').each(function (index, attribute) {
            attributes.push($(attribute).text());
        });

        repositories = root.selectedRepositories;

        $.ajax({
            url: '/run',
            type: 'POST',
            data: JSON.stringify({
                repositories: repositories,
                attributes: attributes
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                console.log('Result', data);
            }
        });
    });

    // root.getRepository('https://github.com/angular/angular').then(function (repo) {
    //     root.repo = repo;
    // });
}(window.App = window.App || {}));
