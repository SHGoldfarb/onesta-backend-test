import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index.js";

dotenv.config();

export const app = express();

if (!process.env.PORT) {
  console.log("No port value specified!");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/", router);
