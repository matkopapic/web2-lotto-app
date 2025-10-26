import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import path from "node:path";
import {auth as auth_oidc, requiresAuth as requiresUserAuth} from 'express-openid-connect';
import storeResults from "./routes/storeResults";
import closeActiveRound from "./routes/closeRound";
import createNewRound from "./routes/createNewRound";
import { auth as auth_oauth2 } from 'express-oauth2-jwt-bearer';
import getActiveRoundInfo from "./routes/getActiveRoundInfo";
import createNewTicket from "./routes/createNewTicket";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const publicPath = path.resolve(__dirname, "../../frontend/src")
const publicBuildPath = path.resolve(__dirname, "../../frontend/dist")

const oidcAuthConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.SITE_BASE_URL,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
};

const requiresM2MAuth = auth_oauth2({
    audience: process.env.SITE_BASE_URL,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256',
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth_oidc(oidcAuthConfig));

app.use(express.static(publicPath));
app.use("/dist", express.static(publicBuildPath));

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(publicPath + "/home/home.html")
});

app.get("/new-ticket", (_req: Request, res: Response) => {
    res.sendFile(publicPath + "/newTicket/newTicket.html")
});

app.get("/me", requiresUserAuth(), (req: Request, res: Response) => {
    res.json(req.oidc.user)
});

app.get("/test", requiresM2MAuth, (_req: Request, res: Response) => {
    res.status(200).send("M2M flow success")
})

app.get("/active-round", getActiveRoundInfo)

app.post("/new-ticket", createNewTicket)

app.post("/new-round", requiresM2MAuth, createNewRound);

app.post("/close", requiresM2MAuth, closeActiveRound);

app.post("/store-results", requiresM2MAuth, storeResults)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

