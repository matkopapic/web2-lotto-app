import {Request, Response} from "express";
import pool from "../database/db";
import handleDatabaseError from "../database/handleDatabaseError";

interface TicketRequest {
    documentNumber: string;
    numbers: number[];
}

async function createNewTicket(req: Request, res: Response) {
    // @ts-ignore
    const user = req.oidc.user ?? null
    if (!user) {
        res.status(403)
        return
    }

    try {
        const activeRounds = await pool.query("SELECT * FROM round WHERE ended_at IS NULL");
        if (activeRounds.rows.length != 1) {
            res.status(400).json({
                message: "No active round to enter ticket in."
            })
            return
        }
        const ticketRequest = validateTicket(req.body);

        if (!ticketRequest) {
            res.status(400).json({
                message: "Invalid ticket."
            })
            return
        }

        const insertedTicket = await pool.query(`
            INSERT INTO ticket (round_id, document_number, user_id, numbers) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [activeRounds.rows[0].id, ticketRequest.documentNumber, user.sub, ticketRequest.numbers.sort((a, b) => a - b)])

        res.redirect(`/ticket/${insertedTicket.rows[0].id}`);
    } catch(e) {
        handleDatabaseError(e, res);
    }
}

function validateTicket(body: any): TicketRequest | null {
    try {
        const documentNumber: string = body.documentNumber;
        const nums: number[] = body.numbers
            .split(",")
            .map((n: string) => parseInt(n.trim()));

        if (!documentNumber || !nums) return null;

        if (documentNumber.length < 1 || documentNumber.length > 20 || !/^\d+$/.test(documentNumber)) return null;

        if (nums.length < 6 || nums.length > 10) {
            return null;
        } else if (new Set(nums).size !== nums.length) {
            return null;
        } else {
            for (let num of nums) {
                if (isNaN(num) || num < 1 || num > 45) {
                    return null;
                }
            }
        }

        return {
            documentNumber: documentNumber,
            numbers: nums,
        };
    } catch (e) {
        console.error(e)
        return null
    }
}

export default createNewTicket;