import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function getActiveRound(req: Request, res: Response) {
    try {
        const activeRounds = await pool.query("SELECT * FROM round WHERE ended_at IS NULL");
        if (activeRounds.rows.length != 1) {
            res.status(204).send();
        } else {
            res.status(200).json(activeRounds.rows[0]);
        }
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default getActiveRound;