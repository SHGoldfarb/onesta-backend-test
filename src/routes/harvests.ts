import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Harvest } from "../models/harvest.ts";
import { Fruit } from "../models/fruit.ts";
import { Client } from "../models/client.ts";
import { Variety } from "../models/variety.ts";
import { Farm } from "../models/farm.ts";
import { Farmer } from "../models/farmer.ts";
import { createHarvestsFromFile } from "../actions/harvests.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const harvests = await Harvest.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_harvests: harvests.length, harvests });
});

router.post("/", async (request: Request, response: Response) => {
  const { fruitId, varietyId, clientId, farmerId, farmId } = request.body;

  // TODO: do this in a loop instead of copy/paste

  const fruit = await Fruit.findByPk(fruitId);
  const variety = await Variety.findByPk(varietyId);
  const client = await Client.findByPk(clientId);
  const farm = await Farm.findByPk(farmId);
  const farmer = await Farmer.findByPk(farmerId);

  const errors = [];

  if (!fruit) {
    errors.push("Fruit doesn't exist");
  }
  if (!variety) {
    errors.push("Variety doesn't exist");
  }
  if (!client) {
    errors.push("Client doesn't exist");
  }
  if (!farm) {
    errors.push("Farm doesn't exist");
  }
  if (!farmer) {
    errors.push("Farmer doesn't exist");
  }

  if (errors.length) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: errors.join("/n") });
  }

  const harvest = await Harvest.create({
    fruitId: fruitId,
    varietyId: varietyId,
    clientId: clientId,
    farmId: farmId,
    farmerId: farmerId,
  });
  return response.status(StatusCodes.CREATED).json({ harvest });
});

router.post("/bulk", async (request: Request, response: Response) => {
  const { csvPath } = request.body;

  const { harvests } = await createHarvestsFromFile({ path: csvPath });

  // TODO: errors

  return response
    .status(StatusCodes.CREATED)
    .json({ harvests, total_created: harvests.length });
});

export const harvestsRouter = router;
