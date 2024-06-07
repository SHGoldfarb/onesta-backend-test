import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Client } from "../models/client.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const clients = await Client.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_clients: clients.length, clients });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, lastName, email } = request.body;

  try {
    const client = await Client.create({ name, lastName, email });
    return response.status(StatusCodes.CREATED).json({ client });
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

export const clientsRouter = router;
