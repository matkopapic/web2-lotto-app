import pg from "pg";
import dotenv from "dotenv";
import {Response} from "express";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number.parseFloat(process.env.DB_PORT ?? ""),
    ssl: {
        rejectUnauthorized: false,
    },
});

pool
    .connect()
    .then(() => console.log("Connected to postgresql database"))
    .catch((err) => console.error("Connection error:", err));

export default pool;