export function parseUsernames(input){
    return input.split(",")
                .map(userName => userName.trim())
}

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

export function sortUsers(users){
    return [...users].sort((a, b) => b.score - a.score)
}

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





