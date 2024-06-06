import express from "express";
import { fruitsRouter } from "./fruits.ts";
import { varietiesRouter } from "./varieties.ts";
import { clientsRouter } from "./clients.ts";
import { farmersRouter } from "./farmers.ts";
import { farmsRouter } from "./farms.ts";
import { harvestsRouter } from "./harvests.ts";

export const router = express.Router();

router.use("/fruits", fruitsRouter);
router.use("/varieties", varietiesRouter);
router.use("/clients", clientsRouter);
router.use("/farmers", farmersRouter);
router.use("/farms", farmsRouter);
router.use("/harvests", harvestsRouter);
