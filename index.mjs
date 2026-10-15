import {fetchUser} from "./api.mjs"
import {parseUsernames, getAvailableLanguages, getLeaderBoardData, sortUsers} from "./helpers.mjs";

const userForm = document.querySelector("#user-form");
const usernameInput = document.querySelector("#usernames");
const leaderboardSection = document.querySelector("#leaderboard-section");
const rankingSelect = document.querySelector("#ranking-select");
const leaderboardBody = document.querySelector("#leaderboard-body");
const userRowTemplate = document.querySelector("#user-row-template");
const rankingOptionTemplate = document.querySelector("#ranking-option-template")
const errorMessage = document.querySelector("#error-message");

let fetchedUserData = []

/**
 * Handles the form submission and fetches data for the entered CodeWars users.
 * Displays the leaderboard for successful users and error messages for failed requests.
 */
userForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    errorMessage.textContent = "";
    errorMessage.hidden = true;
    const usernameList = usernameInput.value
    const userNames = parseUsernames(usernameList)
    fetchedUserData = await fetchUsers(userNames)

    if(fetchedUserData.successfulUsers.length > 0){
        const languages = getAvailableLanguages(fetchedUserData.successfulUsers)
        displayLeaderboard(fetchedUserData.successfulUsers, "overall")
        populateDropdown(languages)
        rankingSelect.value = "overall";
    }
    else{
        leaderboardBody.textContent = ""
        leaderboardSection.hidden = true

    }

    if(fetchedUserData.failedUsers.length > 0){
        const errorMessages = new Set();
        fetchedUserData.failedUsers.forEach((failedUser => {
            if(failedUser.error.type === "invalid-user"){
                errorMessages.add(`User not found: ${failedUser.username} Please check the username and try again.`)
            }
            else if (failedUser.error.type === "network") {
                errorMessages.add("Unable to connect to CodeWars. Please check your internet connection and try again.")
            } else if (failedUser.error.type === "api") {
                errorMessages.add("CodeWars is currently unavailable. Please try again later.")
            }
        }))
        displayError([...errorMessages].join(" "));
    }
})
/**
 * Creates and displays the leaderboard for the selected ranking.
 *
 * @param {Array} users - The successfully fetched CodeWars users.
 * @param {string} ranking - The selected ranking, such as "overall" or "javascript".
 */
function displayLeaderboard(users, ranking) {
    const userData = getLeaderBoardData(users, ranking)
    const sortedLeaderBoardData = sortUsers(userData)
    leaderboardSection.hidden = false
    renderTable(sortedLeaderBoardData)
}

/**
 * Fetches data for multiple CodeWars usernames.
 * Separates successful requests from failed requests.
 *
 * @param {Array} usernames - The CodeWars usernames to fetch.
 * @returns {Object} An object containing successful users and failed users.
 */
async function fetchUsers(usernames) {
    const successfulUsers = [];
    const failedUsers = [];

    const results = await Promise.allSettled(usernames.map(username => fetchUser(username)))
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            successfulUsers.push(result.value)
        } else if (result.status === "rejected") {
            failedUsers.push({
                username: usernames[index],
                error: result.reason
            })
        }
    })
    return {
        successfulUsers, failedUsers
    }
}

/**
 * Creates a table row containing a user's leaderboard information.
 *
 * @param {Object} user - The user data to display.
 * @returns {DocumentFragment} A cloned table row containing the user's details.
 */
function createUserRow(user) {
    const userRow = userRowTemplate.content.cloneNode(true);
    const usernameCell = userRow.querySelector(".username")
    const userClanCell = userRow.querySelector(".clan")
    const userScoreCell = userRow.querySelector(".score")

    usernameCell.textContent = user.username
    userClanCell.textContent = user.clan
    userScoreCell.textContent = user.score;

    return userRow
}

/**
 * Clears the existing leaderboard and renders the supplied users.
 * Highlights the first user in the sorted leaderboard.
 *
 * @param {Array} users - The sorted leaderboard data to display.
 */
function renderTable(users){
    leaderboardBody.textContent = ""
    users.forEach(( user => {
        const userRow = createUserRow(user)
        leaderboardBody.append(userRow)
    }))
    const firstRow = leaderboardBody.firstElementChild
    if (firstRow) {
        firstRow.classList.add("top-user")
    }
}


/**
 * Creates a dropdown option for a CodeWars language ranking.
 *
 * @param {string} language - The name of the language ranking.
 * @returns {DocumentFragment} A cloned option containing the language.
 */
function createRankingOptions(language) {
    const rankingOption = rankingOptionTemplate.content.cloneNode(true)
    const option = rankingOption.querySelector("option");
    option.textContent = language
    option.value = language

    return rankingOption
}

/**
 * Updates the ranking dropdown with the available language rankings.
 * Keeps the Overall option and removes previously added language options.
 *
 * @param {Set<string>} ranks - A Set containing the available language names.
 */
function populateDropdown(ranks){
    for (const option of [...rankingSelect.options]) {
        if (option.value !== "overall") {
            option.remove()
        }
    }
    ranks.forEach((rank => {
        const optionRank = createRankingOptions(rank)
        rankingSelect.append(optionRank)
    }))
}
/**
 * Updates the leaderboard when the user selects a different ranking.
 */
rankingSelect.addEventListener("change", () => {
    const selectedRanking = rankingSelect.value
    displayLeaderboard(fetchedUserData.successfulUsers, selectedRanking)
})

/**
 * Displays an error message to the user.
 *
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}




