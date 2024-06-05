import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Fruit } from "../models/fruit.ts";
import { Variety } from "../models/variety.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const fruits = await Fruit.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_fruits: fruits.length, fruits });
});

router.post("/", async (request: Request, response: Response) => {
  const { name, varietyId } = request.body;

  const variety = await Variety.findByPk(varietyId);
  if (!variety) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Variety doesn't exist" });
  }

  const fruit = await Fruit.create({ name, varietyId: variety.id });
  return response.status(StatusCodes.CREATED).json({ fruit });
});

export const fruitsRouter = router;
