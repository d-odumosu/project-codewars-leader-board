export async function fetchUser(user) {
    const url = ` https://www.codewars.com/api/v1/users/${user}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Invalid user:${user} not found`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error
    }
}