import express from "express";
import { fruitsRouter } from "./fruits.ts";
import { varietiesRouter } from "./varieties.ts";
import { clientsRouter } from "./clients.ts";

export const router = express.Router();

router.use("/fruits", fruitsRouter);
router.use("/varieties", varietiesRouter);
router.use("/clients", clientsRouter);
