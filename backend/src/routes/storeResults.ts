import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

type StoreResultsRequest = {
    numbers: number[]
}

async function storeResults(req: Request, res: Response) {
    const body = req.body as StoreResultsRequest;
    const numbers = body.numbers;
    if (numbers == undefined || numbers.length != 6) {
        return res.status(400).json({
            message: "Invalid request body"
        })
    }
    for (const number of numbers) {
        if (!Number.isInteger(number)) return res.status(400).json({
            message: "Only integers allowed"
        })
        if (number < 1 || number > 45) {
            return res.status(400).json({
                message: "Numbers must be between 1 and 45"
            })
        }
    }
    const notDrawnRounds = await pool.query("SELECT * FROM round WHERE drawn_at IS NULL AND ended_at IS NOT NULL");
    if (notDrawnRounds.rows.length != 1) {
        return res.status(400).json({
            message: "No rounds available for storing numbers"
        })
    }
    try {
        const updatedRound = await pool.query(`
                UPDATE round SET 
                drawn_at = NOW(), 
                drawn_numbers = $1 
                WHERE id = $2 RETURNING *;
            `, [numbers.sort((a, b) => a - b), notDrawnRounds.rows[0].id]);
        res.status(204).send();
    } catch (error) {
        handleDatabaseError(error, res)
    }
}

export default storeResults;