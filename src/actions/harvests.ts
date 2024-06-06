import fs from "fs";
import { parse } from "csv-parse";
import { Harvest } from "../models/harvest.ts";
import { Farmer } from "../models/farmer.ts";
import { Client } from "../models/client.ts";
import { Farm } from "../models/farm.ts";
import { Fruit } from "../models/fruit.ts";
import { Variety } from "../models/variety.ts";

const processRow = async (row: string[]) => {
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
  // TODO: handle the many errors that may happen
  // TODO: add and handle model constrains

  const farmer =
    (await Farmer.findOne({ where: { email: farmerEmail } })) ||
    (await Farmer.create({
      name: farmerName,
      lastName: farmerLastName,
      email: farmerEmail,
    }));

  const client =
    (await Client.findOne({ where: { email: clientEmail } })) ||
    (await Client.create({
      name: clientName,
      lastName: clientLastName,
      email: clientEmail,
    }));

  const farm =
    (await Farm.findOne({ where: { name: farmName } })) ||
    (await Farm.create({
      name: farmName,
      address: farmAddress,
    }));

  const fruit =
    (await Fruit.findOne({ where: { name: fruitName } })) ||
    (await Fruit.create({
      name: fruitName,
    }));

  const variety =
    (await Variety.findOne({ where: { name: varietyName } })) ||
    (await Variety.create({
      name: varietyName,
    }));

  const harvest = await Harvest.create({
    farmerId: farmer.id,
    clientId: client.id,
    farmId: farm.id,
    fruitId: fruit.id,
    varietyId: variety.id,
  });

  return harvest;
};

export const createHarvestsFromFile = async ({ path }: { path: string }) => {
  const harvestPromises: Promise<Harvest>[] = [];
  await new Promise<void>((resolve) => {
    fs.createReadStream(path)
      .pipe(parse({ delimiter: ";", from_line: 2 }))
      .on("data", (row) => {
        harvestPromises.push(processRow(row));
      })
      .on("end", () => {
        resolve();
      });
  });

  const harvests = await Promise.all(
    harvestPromises.map(async (harvestPromise) => await harvestPromise),
  );

  return { harvests };
};
