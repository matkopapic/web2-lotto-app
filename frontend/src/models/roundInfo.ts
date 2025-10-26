import {Ticket} from "./ticket.js";

export interface RoundInfo {
    roundNum: number;
    startedAt: string;
    endedAt: string | null;
    drawnAt: string | null;
    drawnNumbers: number[];
    userTickets: Ticket[] | null;
}