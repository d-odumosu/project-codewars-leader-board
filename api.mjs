export async function fetchUser(username) {
    const url = `https://www.codewars.com/api/v1/users/${username}`;

    let response;
    // NETWORK ERROR HANDLING
    try {
        response = await fetch(url);
    }
    catch(error){
        const networkError = new Error(
            "Unable to connect to CodeWars. Please check your internet connection."
        );

        networkError.type = "network";

        throw networkError;
    }
    // INVALID USER
    if(response.status === 404){
        const invalidUserError = new Error(
            `Invalid user: ${username} not found`
        )
        invalidUserError.type = "invalid-user";

        throw invalidUserError
    }
    // OTHER API/HTTP ERROR
    if (!response.ok) {
        const apiError = new Error(
            "The CodeWars API is currently unavailable. Please try again later."
        );

        apiError.type = "api";

        throw apiError;
    }
    // SUCCESS
    return await response.json();

}