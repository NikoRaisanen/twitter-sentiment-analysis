export const stringifyResult = (score, searchTerm) => {
    var keyword;
    var statement;
    if (score >= 0.3) {
        keyword = "Very Positive";
        statement = `Looks like the people of Twitter are quite fond of "${searchTerm}"...`;
    } else if (score >= 0.1) {
        keyword = "Slightly Positive";
        statement = `Looks like the people of Twitter kind of like "${searchTerm}"...`;
    } else if (score <= -0.3) {
        keyword = "Very Negative";
        statement = `Looks like the people of Twitter REALLY don't like "${searchTerm}"...`;
    } else if (score <= -0.1) {
        keyword = "Slightly Negative";
        statement = `Looks like the people of Twitter aren't fans of "${searchTerm}"...`;
    } else {
        keyword = "Neutral";
        statement = `Looks like the people of Twitter are indifferent about "${searchTerm}"...`;
    }
    return {
        keyword: keyword,
        statement: statement
    };
}

export const sentimentToPercentage = (score) => {
    var percentage = 0;
    percentage = 0.50 + (score / 2)
    return parseInt(percentage * 100);
}
