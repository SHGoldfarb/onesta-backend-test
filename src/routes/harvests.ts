import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Harvest } from "../models/harvest.ts";
import { createHarvestsFromFile } from "../actions/harvests.ts";
import {
  ForeignKeyConstraintError,
  Model,
  ModelStatic,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import { Fruit } from "../models/fruit.ts";
import { Variety } from "../models/variety.ts";
import { Client } from "../models/client.ts";
import { Farmer } from "../models/farmer.ts";
import { Farm } from "../models/farm.ts";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  const harvests = await Harvest.findAll();

  return response
    .status(StatusCodes.OK)
    .json({ total_harvests: harvests.length, harvests });
});

router.post("/", async (request: Request, response: Response) => {
  try {
    const harvest = await Harvest.create(request.body);
    return response.status(StatusCodes.CREATED).json({ harvest });
  } catch (error) {
    if (
      error instanceof UniqueConstraintError ||
      error instanceof ValidationError
    ) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.errors.map((e) => e.message).join("\n") });
    } else if (error instanceof ForeignKeyConstraintError) {
      const models: { [key: string]: ModelStatic<Model> } = {
        fruit: Fruit,
        variety: Variety,
        client: Client,
        farmer: Farmer,
        farm: Farm,
      };

      const errors = (
        await Promise.all(
          Object.keys(models).map(async (modelName) => {
            const Model = models[modelName];
            const primaryKey = request.body[`${modelName}Id`];
            if (!(await Model.findByPk(primaryKey))) {
              return `${modelName} doesn't exist`;
            }

            return "";
          }),
        )
      ).filter((error) => error !== "");

      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: errors.join("\n") });
    }

    throw error;
  }
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
