import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function getActiveRoundInfo(req: Request, res: Response) {
    // @ts-ignore
    const user = req.oidc.user ?? null
    try {
        const latestRound = (await pool.query(`
                SELECT *
                FROM round
                ORDER BY number DESC
                LIMIT 1;
            `)).rows[0];
        let userTickets: any | null = null;
        if (user) {
            userTickets = (await pool.query(`
                SELECT 
                    id, 
                    document_number,
                    created_at,
                    numbers
                FROM ticket t
                WHERE t.round_id = $1 AND t.user_id = $2
            `, [latestRound.id, user.sub])).rows;
        }

        res.json({
            round_num: latestRound.number,
            started_at: latestRound.started_at,
            ended_at: latestRound.ended_at,
            drawn_at: latestRound.drawn_at,
            drawn_numbers: latestRound.drawn_numbers,
            user_tickets: userTickets,
        })
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default getActiveRoundInfo;