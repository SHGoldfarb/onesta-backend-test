import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Fruit } from "../models/fruit.js";

export const fruitsRouter = express.Router();

fruitsRouter.get("/fruits", async (request: Request, response: Response) => {
  const fruits = await Fruit.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_fruits: fruits.length, fruits });
});
