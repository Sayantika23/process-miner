module.exports = {
    toFetch() {
        return ['loc'];
    },
    run: function (repository) {
        const commentLines = repository.extracted_data.loc.commentLines;
        const codeLines = repository.extracted_data.loc.codeLines;
        const Md = commentLines / (commentLines + codeLines);

        return {
            Md,
            commentLines: commentLines,
            nonBlankSourceCodeLines: codeLines
        };
    }
};