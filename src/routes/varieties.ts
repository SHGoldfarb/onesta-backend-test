import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Variety } from "../models/variety.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const varieties = await Variety.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_varieties: varieties.length, varieties });
});

router.post("/", async (request: Request, response: Response) => {
  const { name } = request.body;

  try {
    const variety = await Variety.create({ name });
    return response.status(StatusCodes.CREATED).json({ variety });
  } catch (error) {
    if (
      error instanceof UniqueConstraintError ||
      error instanceof ValidationError
    ) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.errors.map((e) => e.message).join("\n") });
    }
    throw error;
  }
});

export const varietiesRouter = router;
