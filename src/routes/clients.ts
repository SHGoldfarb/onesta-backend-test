import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Client } from "../models/client.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const clients = await Client.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_clients: clients.length, clients });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, lastName, email } = request.body;

  const client = await Client.create({ name, lastName, email });

  return response.status(StatusCodes.CREATED).json({ client });
});

export const clientsRouter = router;
