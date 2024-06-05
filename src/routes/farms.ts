import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Farm } from "../models/farm.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const farms = await Farm.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_farms: farms.length, farms });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, address } = request.body;

  const farm = await Farm.create({ name, address });

  return response.status(StatusCodes.CREATED).json({ farm });
});

export const farmsRouter = router;
