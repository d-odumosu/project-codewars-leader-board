/**
 * Parses a comma-separated string of usernames.
 *
 * Each username is trimmed to remove any unnecessary
 * whitespace around the name.
 *
 * @param {string} input - A comma-separated string of usernames.
 * @returns {string[]} An array of usernames with whitespace removed.
 */
export function parseUsernames(input){

    return [...new Set(
        input.split(",")
                .map(userName => userName.trim())
    )];
}
/**
 * Gets all unique programming languages available across a list of users.
 *
 * A Set is used to prevent duplicate language names from being included.
 *
 * @param {Object[]} users - An array of Codewars user objects.
 * @returns {Set<string>} A Set containing the unique programming languages.
 */
export function getAvailableLanguages(users){
    const languages = new Set()
    for(const user of users){
        const userLanguages = Object.keys(user.ranks.languages)
        for(const lang of userLanguages){
            languages.add(lang)
        }
    }
    return languages
}
/**
 * Sorts users by their score in descending order.
 *
 * A copy of the array is created so that the original array
 * is not modified.
 *
 * @param {Object[]} users - An array of leaderboard user objects.
 * @returns {Object[]} A new array of users sorted from highest to lowest score.
 */
export function sortUsers(users){
    return [...users].sort((a, b) => b.score - a.score)
}
/**
 * Creates leaderboard data for the selected ranking.
 *
 * If "overall" is selected, each user's overall score is used.
 * Otherwise, the user's score for the selected language is used.
 * Users who do not have a ranking for the selected language are skipped.
 *
 * @param {Object[]} users - An array of Codewars user objects.
 * @param {string} selectedRanking - The ranking to use, such as "overall" or "javascript".
 * @returns {Object[]} An array containing each user's username, clan and selected score.
 */
export function getLeaderBoardData(users, selectedRanking){
    const leaderBoardData = []
    const ranking  = selectedRanking.toLowerCase()

    for(const user of users){
        let score;

        if(ranking === "overall"){
            score = user.ranks.overall.score
        }
        else if(!user.ranks.languages[ranking]){
            continue
        }
        else{
            score = user.ranks.languages[ranking].score
        }
        const leaderBoardUser = {
            username: user.username,
            clan: user.clan,
            score: score
        }
        leaderBoardData.push(leaderBoardUser)
    }
    return leaderBoardData
}





