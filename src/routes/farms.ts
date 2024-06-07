import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Farm } from "../models/farm.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const farms = await Farm.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_farms: farms.length, farms });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, address } = request.body;

  try {
    const farm = await Farm.create({ name, address });
    return response.status(StatusCodes.CREATED).json({ farm });
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

export const farmsRouter = router;
