export async function fetchUser(username) {
    const url = ` https://www.codewars.com/api/v1/users/${username}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Invalid user:${username} not found`);
        }
        return await response.json();
    } catch (error) {
        throw error
    }
}