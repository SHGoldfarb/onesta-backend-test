import express from "express";
import { fruitsRouter } from "./fruits.js";
import { varietiesRouter } from "./varieties.js";

export const router = express.Router();

router.use("/fruits", fruitsRouter);
router.use("/varieties", varietiesRouter);
