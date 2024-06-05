import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Farmer } from "../models/farmer.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const farmers = await Farmer.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_farmers: farmers.length, farmers });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, lastName, email } = request.body;

  const farmer = await Farmer.create({ name, lastName, email });

  return response.status(StatusCodes.CREATED).json({ farmer });
});

export const farmersRouter = router;
