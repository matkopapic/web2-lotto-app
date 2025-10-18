import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const publicPath = __dirname + "/public"
const publicBuildPath = path.resolve(__dirname, "./../dist/public")

app.use(express.static(publicPath));
app.use("/dist", express.static(publicBuildPath));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(publicPath + "/home/home.html")
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
