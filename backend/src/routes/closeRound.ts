import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function closeActiveRound(req: Request, res: Response) {
    try {
        const activeRounds = await pool.query("SELECT * FROM round WHERE ended_at IS NULL");
        if (activeRounds.rows.length != 1) {
            res.status(204).send();
        } else {
            const updatedRound = await pool.query(`
                UPDATE round SET ended_at = NOW() 
                WHERE id = $1 RETURNING *;
            `, [activeRounds.rows[0].id]);
            res.status(200).json(updatedRound.rows[0]);
        }
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default closeActiveRound;