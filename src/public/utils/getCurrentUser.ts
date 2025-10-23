export interface User {
    username: string;
    email: string;
    picture: string;
}

export async function getCurrentUser(): Promise<User | null> {
    const baseUrl = process.env.SITE_BASE_URL;
    try {
        const response = await fetch(`${baseUrl}/me`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return null; // user not logged in or session expired
        }

        const data = await response.json();

        return {
            username: data.username,
            email: data.email,
            picture: data.picture,
        };
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        return null;
    }
}