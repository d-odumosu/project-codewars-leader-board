import {fetchUser} from "./api.mjs"
import {parseUsernames, getAvailableLanguages, getLeaderBoardData, sortUsers} from "./helpers.mjs";

const userForm = document.querySelector("#user-form");
const usernameInput = document.querySelector("#usernames");
const leaderboardSection = document.querySelector("#leaderboard-section");
const rankingSelect = document.querySelector("#ranking-select");
const leaderboardBody = document.querySelector("#leaderboard-body");
const userRowTemplate = document.querySelector("#user-row-template");
const rankingOptionTemplate = document.querySelector("#ranking-option-template")

let userNames = [];
let fetchedUserData = []

userForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const usernameList = usernameInput.value
    userNames = parseUsernames(usernameList)
    fetchedUserData = await fetchUsers(userNames)
    const languages = getAvailableLanguages(fetchedUserData.successfulUsers)
    displayLeaderboard(fetchedUserData.successfulUsers, "overall")
    populateDropdown(languages)
})

function displayLeaderboard(users, ranking) {
    const userData = getLeaderBoardData(users, ranking)
    const sortedLeaderBoardData = sortUsers(userData)
    leaderboardSection.hidden = false
    renderTable(sortedLeaderBoardData)
}

async function fetchUsers(usernames) {
    const successfulUsers = [];
    const failedUsernames = [];

    const results = await Promise.allSettled(usernames.map(username => fetchUser(username)))
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            successfulUsers.push(result.value)
        } else if (result.status === "rejected") {
            failedUsernames.push(usernames[index])
        }
    })
    return {
        successfulUsers, failedUsernames
    }
}

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

function renderTable(users){
    leaderboardBody.textContent = ""
    users.forEach(( user => {
        const userRow = createUserRow(user)
        leaderboardBody.append(userRow)
    }))

}

function createRankingOptions(language) {
    const rankingOption = rankingOptionTemplate.content.cloneNode(true)
    const option = rankingOption.querySelector("option");
    option.textContent = language
    option.value = language

    return rankingOption
}

function populateDropdown(ranks){
    ranks.forEach((rank => {
        const optionRank = createRankingOptions(rank)
        rankingSelect.append(optionRank)
    }))
}

rankingSelect.addEventListener("change", (event) => {
    const selectedRanking = rankingSelect.value
    displayLeaderboard(fetchedUserData.successfulUsers, selectedRanking)
})


//function displayError(){}
// clear select dropdown
//highlight highest score




