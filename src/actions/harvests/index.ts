import { Harvest } from "../../models/harvest.ts";
import { Farmer } from "../../models/farmer.ts";
import { Client } from "../../models/client.ts";
import { Farm } from "../../models/farm.ts";
import { Fruit } from "../../models/fruit.ts";
import { Variety } from "../../models/variety.ts";
import { InconsistencyError } from "../../utils.ts";

export const createHarvest = async ({
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
}: {
  farmerEmail: string;
  farmerName: string;
  farmerLastName: string;
  clientEmail: string;
  clientName: string;
  clientLastName: string;
  farmName: string;
  farmAddress: string;
  fruitName: string;
  varietyName: string;
}) => {
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

  return harvest;
};
