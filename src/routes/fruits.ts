import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Fruit } from "../models/fruit.js";

const router = express.Router();

router.get("/fruits", async (request: Request, response: Response) => {
  const fruits = await Fruit.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_fruits: fruits.length, fruits });
});

router.post("/fruits", async (request: Request, response: Response) => {
  const { name } = request.body;
  console.log(request);

  if (!name) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: `Please provide the name of the fruit` });
  }

  const fruit = await Fruit.create({ name });

  return response.status(StatusCodes.CREATED).json({ fruit });
});

export const fruitsRouter = router;