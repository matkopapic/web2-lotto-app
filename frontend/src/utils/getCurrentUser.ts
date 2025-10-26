import {config} from "../config/config.js";
import {User} from "../models/user.js";

const baseUrl = config.BASE_URL;

export async function getCurrentUser(): Promise<User | null> {
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