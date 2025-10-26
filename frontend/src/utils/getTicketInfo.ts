import {config} from "../config.js";
import {RoundInfo} from "../models/roundInfo.js";

const baseUrl = config.BASE_URL;

export async function getTicketInfo(ticketId: string): Promise<RoundInfo | null> {
    try {
        const response = await fetch(`${baseUrl}/ticket/${ticketId}/info`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return {
            roundNum: data.round_num,
            startedAt: data.started_at,
            endedAt: data.ended_at,
            drawnAt: data.drawn_at,
            drawnNumbers: data.drawn_numbers,
            userTickets: data.user_tickets.map((ticket: any) => ({
                id: ticket.id,
                documentNum: ticket.document_number,
                numbers: ticket.numbers,
                createdAt: ticket.created_at,
            }))
        };
    } catch (error) {
        console.error("Failed to fetch ticket info:", error);
    }

    return null;
}