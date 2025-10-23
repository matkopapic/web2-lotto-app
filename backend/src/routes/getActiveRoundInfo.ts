import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function getActiveRoundInfo(req: Request, res: Response) {
    // @ts-ignore
    const user = req.oidc.user ?? null
    try {
        if (user) {
            const userTickets = await pool.query(`
                SELECT t.*, r.*
                FROM round r
                LEFT JOIN ticket t
                    ON t.round_id = r.id AND t.user_id = $1
                WHERE r.ended_at IS NULL;
            `, [user.sub]);
            console.log(userTickets.rows)
            if (userTickets.rows.length != 1) {
                res.status(204).send();
            } else {
                res.status(200).json(userTickets.rows[0]);
            }
        } else {
            const activeRounds = await pool.query(`
                SELECT *
                FROM round
                WHERE ended_at IS NULL;
            `);
            if (activeRounds.rows.length != 1) {
                res.status(204).send();
            } else {
                res.status(200).json(activeRounds.rows[0]);
            }
        }
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default getActiveRoundInfo;