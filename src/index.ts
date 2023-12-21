import { config } from "dotenv";
config();

export const envs = process.env;

import cors from "cors";
import express, { Application } from "express";
import ApiRoute from "routes/api";

config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", ApiRoute);

app.get("/", async (req, res) => {
  res.send("Hello from ts");
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}/`);
});
