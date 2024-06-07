import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Fruit } from "../models/fruit.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const fruits = await Fruit.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_fruits: fruits.length, fruits });
});

router.post("/", async (request: Request, response: Response) => {
  const { name } = request.body;

  try {
    const fruit = await Fruit.create({ name });
    return response.status(StatusCodes.CREATED).json({ fruit });
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

export const fruitsRouter = router;
