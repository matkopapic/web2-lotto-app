import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

async function createNewRound(req: Request, res: Response) {
    try {
        const activeRounds = await pool.query("SELECT * FROM round WHERE ended_at IS NULL");
        if (activeRounds.rows.length != 0) {
            res.status(204).send();
        } else {
            const newRound = await pool.query(`
                INSERT INTO round (number)
                SELECT COALESCE(MAX(number), 0) + 1
                FROM round RETURNING *;
            `);
            res.status(201).json(newRound.rows[0]);
        }
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default createNewRound;