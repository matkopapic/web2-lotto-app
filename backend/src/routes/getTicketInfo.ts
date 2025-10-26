import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function getTicketInfo(req: Request, res: Response) {
    const ticketId = req.params.id;

    try {
        const ticket = (await pool.query(`
                SELECT 
                    t.id ticket_id,
                    t.created_at,
                    t.document_number,
                    t.numbers,
                    r.*
                FROM ticket t
                INNER JOIN round r
                ON t.round_id = r.id
                WHERE t.id = $1
                LIMIT 1;
            `, [ticketId])).rows[0];

        res.json({
            round_num: ticket.number,
            started_at: ticket.started_at,
            ended_at: ticket.ended_at,
            drawn_at: ticket.drawn_at,
            drawn_numbers: ticket.drawn_numbers,
            user_tickets: [{
                id: ticket.ticket_id,
                document_number: ticket.document_number,
                numbers: ticket.numbers,
                created_at: ticket.created_at,
            }],
        })
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default getTicketInfo;