import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes/index.js";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: are these necessary?
app.use(cors());
app.use(helmet());

app.use("/", router);
