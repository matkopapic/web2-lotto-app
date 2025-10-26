import {Request, Response} from "express";
import QRCode from "qrcode";

const baseUrl = process.env.SITE_BASE_URL

async function ticketQrCode(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
        const buffer = await QRCode.toBuffer(`${baseUrl}/ticket/${id}`);

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Disposition", "inline; filename=qrcode.jpg");

        res.send(buffer);
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).send("Failed to generate QR code");
    }
}

export default ticketQrCode;