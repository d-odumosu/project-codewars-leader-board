import test from "node:test";
import describe  from "node:test";
import assert from "node:assert";
import nock from "nock";
import { fetchUser } from "./api.mjs";
import { getLeaderBoardData } from "./helpers.mjs"

describe("FetchUser", () => {

    test("fetchUser returns a Code wars user", async () => {
        const scope = nock("https://www.codewars.com/api/v1/users")
            .get("/alice1")
            .reply(200, {
                username: "alice1",
                clan: "some clan",
                ranks: {
                    overall: {
                        score: 2116,
                    }
                }
            });

        // Check that the response we got back included the fake body we set up.
        const user = await fetchUser('alice1');

        assert.equal(user.username, 'alice1');
        assert.equal(user.clan, 'some clan')
        assert(scope.isDone() === true, "No matching fetch request has been made");
    });

    test("throws an error for an invalid user", async () => {

        const username = "user-not-found"
        const scope = nock("https://www.codewars.com/api/v1/users")
            .get(`/${username}`)
            .reply(404, {
                message: `Invalid user:${username} not found`
            })

        await assert.rejects(()=> fetchUser(username), {
            message: `Invalid user: ${username} not found`
        })

        assert(scope.isDone() === true, "No matching fetch request has been made")
    })
});

describe("getLeaderboardData", () => {
    const users = [
        {
            username: 'alice',
            clan: 'code your future',
            ranks: {
                overall:{
                    score: 3009,
                },
                languages: {
                    javascript:{
                        score: 1009,
                    },
                    ruby:{
                        score: 2908
                    },
                    coffeescript: {
                        score: 5345,
                    }
                }
            }
        },
        {
            username: 'bob',
            clan: 'code academy',
            ranks: {
                overall: {
                    score: 2500,
                },
                languages: {
                    javascript: {
                        score: 1800,
                    },
                    python: {
                        score: 2200,
                    }
                }
            }
        },
        {
            username: 'charlie',
            clan: 'developers united',
            ranks: {
                overall: {
                    score: 4200,
                },
                languages: {
                    ruby: {
                        score: 3500,
                    },
                    python: {
                        score: 1900,
                    },
                    java: {
                        score: 2800,
                    }
                }
            }
        },
        {
            username: 'david',
            clan: 'tech learners',
            ranks: {
                overall: {
                    score: 1800,
                },
                languages: {
                    javascript: {
                        score: 1200,
                    },
                    java: {
                        score: 1600,
                    }
                }
            }
        }
    ]

    test("returns overall scores", () => {
        const expectedResult = [
            {
                username: 'alice',
                clan: 'code your future',
                score: 3009
            },
            {
                username: 'bob',
                clan: 'code academy',
                score: 2500
            },
            {
                username: 'charlie',
                clan: 'developers united',
                score: 4200
            },
            {
                username: 'david',
                clan: 'tech learners',
                score: 1800
            }
        ];
        const input = "overall"
        const result = getLeaderBoardData(users, input)
        assert.deepEqual(result, expectedResult )
    });

    test("returns language scores", () => {
        const expectedResult = [
            {
                username: "alice",
                clan: "code your future",
                score: 1009
            },
            {
                username: "bob",
                clan: "code academy",
                score: 1800
            },
            {
                username: "david",
                clan: "tech learners",
                score: 1200
            }
        ];
        const input = "javascript"
        const result = getLeaderBoardData(users, input)
        assert.deepEqual(result, expectedResult)
    });
});