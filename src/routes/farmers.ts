import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Farmer } from "../models/farmer.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const farmers = await Farmer.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_farmers: farmers.length, farmers });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, lastName, email } = request.body;

  try {
    const farmer = await Farmer.create({ name, lastName, email });
    return response.status(StatusCodes.CREATED).json({ farmer });
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

export const farmersRouter = router;
