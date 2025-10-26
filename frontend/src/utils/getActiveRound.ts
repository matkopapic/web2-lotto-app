import {RoundInfo} from "../models/roundInfo.js";
import {config} from "../config/config.js";

const baseUrl = config.BASE_URL;

export async function getActiveRound(): Promise<RoundInfo | null> {
    try {
        const response = await fetch(`${baseUrl}/active-round`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        const roundInfo: RoundInfo = {
            roundNum: data.round_num,
            startedAt: data.started_at,
            endedAt: data.ended_at,
            drawnAt: data.drawn_at,
            drawnNumbers: data.drawn_numbers,
            userTickets: null,
        };

        if (data.user_tickets) {
            roundInfo.userTickets = data.user_tickets.map((ticket: any) => ({
                id: ticket.id,
                documentNum: ticket.document_number,
                numbers: ticket.numbers,
                createdAt: ticket.created_at,
            }));
        }

        return roundInfo;
    } catch (error) {
        console.error("Failed to fetch active round:", error);
    }

    return null;
}