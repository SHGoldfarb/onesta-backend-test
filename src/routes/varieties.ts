import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Variety } from "../models/variety.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const varieties = await Variety.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_varieties: varieties.length, varieties });
});

router.post("/", async (request: Request, response: Response) => {
  const { name } = request.body;

  const variety = await Variety.create({ name });

  return response.status(StatusCodes.CREATED).json({ variety });
});

export const varietiesRouter = router;
