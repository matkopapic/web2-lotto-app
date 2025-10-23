import {Response} from "express";

function handleDatabaseError(error: any, res: Response) {
    console.error(error);
    res.status(500).json({
        message: "Database error",
    });
}

export default handleDatabaseError;