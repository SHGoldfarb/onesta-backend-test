import fs from "fs";
import { parse } from "csv-parse";
import { ValidationError } from "sequelize";
import { InconsistencyError, asyncReduce } from "../../utils.ts";
import { createHarvest } from "./create.ts";

// Create a harvest and all associations that aren't already in the database.
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

  try {
    const harvest = await createHarvest({
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

    throw error;
  }
};

// Read csv file and create harvests.
export const createHarvestsFromFile = async ({ path }: { path: string }) => {
  try {
    const rows: string[][] = [];
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
        // CSV is formatted incorrectly
        return {
          harvests: [],
          errors: [error.message],
        };
      }
    }

    throw error;
  }
};
