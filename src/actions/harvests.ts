import fs from "fs";
import { parse } from "csv-parse";
import { Harvest } from "../models/harvest.ts";
import { Farmer } from "../models/farmer.ts";
import { Client } from "../models/client.ts";
import { Farm } from "../models/farm.ts";
import { Fruit } from "../models/fruit.ts";
import { Variety } from "../models/variety.ts";
import { ValidationError } from "sequelize";
import { asyncReduce } from "../utils.ts";

class InconsistencyError extends Error {
  constructor(model: string) {
    super(`${model} has attributes inconsistent with database`);
  }
}

const processRow = async (row: string[], lineNumber: number) => {
  const [
    farmerEmail,
    farmerName,
    farmerLastName,
    clientEmail,
    clientName,
    clientLastName,
    farmName,
    farmAddress,
    fruitName,
    varietyName,
  ] = row;

  // TODO: too much copy/paste here

  try {
    const [farmer] = await Farmer.findOrCreate({
      where: { email: farmerEmail },
      defaults: {
        name: farmerName,
        lastName: farmerLastName,
        email: farmerEmail,
      },
    });

    if (farmer.name !== farmerName || farmer.lastName !== farmerLastName) {
      throw new InconsistencyError("farmer");
    }

    const [client] = await Client.findOrCreate({
      where: { email: clientEmail },
      defaults: {
        name: clientName,
        lastName: clientLastName,
        email: clientEmail,
      },
    });

    if (client.name !== clientName || client.lastName !== clientLastName) {
      throw new InconsistencyError("client");
    }

    const [farm] = await Farm.findOrCreate({
      where: { name: farmName },
      defaults: {
        name: farmName,
        address: farmAddress,
      },
    });

    if (farm.address !== farmAddress) {
      throw new InconsistencyError("farm");
    }

    const [fruit] = await Fruit.findOrCreate({
      where: { name: fruitName },
    });
    const [variety] = await Variety.findOrCreate({
      where: { name: varietyName },
    });

    const harvest = await Harvest.create({
      farmerId: farmer.id,
      clientId: client.id,
      farmId: farm.id,
      fruitId: fruit.id,
      varietyId: variety.id,
    });

    return { harvest, error: null };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        harvest: null,
        error: `Line ${lineNumber}: ${error.errors[0].instance}: ${error.errors[0].message}`,
      };
    } else if (error instanceof InconsistencyError) {
      return {
        harvest: null,
        error: `Line ${lineNumber}: ${error.message}`,
      };
    }

    console.log(error);
    throw error;
  }
};

export const createHarvestsFromFile = async ({ path }: { path: string }) => {
  const rows: string[][] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(parse({ delimiter: ";", from_line: 2 }))
        .on("data", (row: string[]) => {
          rows.push(row);
        })
        .on("end", () => {
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // Process rows one at a time.
    // Can't process concurrently because sequelize has a bug where
    // concurrent executions of Model.findOrCreate() on an in-memory database
    // will throw an error.
    return asyncReduce(
      rows.map((row, i) => async ({ harvests, errors }) => {
        const { harvest, error } = await processRow(row, i + 2);
        return {
          harvests: harvest ? [...harvests, harvest] : harvests,
          errors: error ? [...errors, error] : errors,
        };
      }),
      { harvests: [], errors: [] },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.constructor.name === "CsvError") {
        return {
          harvests: [],
          errors: [error.message],
        };
      }
    }

    throw error;
  }
};
