import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Variety } from "../models/variety.js";

const router = express.Router();

router.get("/varieties", async (request: Request, response: Response) => {
  const varieties = await Variety.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_varieties: varieties.length, varieties });
});

router.post("/varieties", async (request: Request, response: Response) => {
  const { name } = request.body;
  console.log(request);

  if (!name) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: `Please provide the name of the variety` });
  }

  const variety = await Variety.create({ name });

  return response.status(StatusCodes.CREATED).json({ variety });
});

export const varietiesRouter = router;
