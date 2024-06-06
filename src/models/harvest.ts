import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";
import { Variety } from "./variety.ts";
import { Fruit } from "./fruit.ts";
import { Client } from "./client.ts";
import { Farm } from "./farm.ts";
import { Farmer } from "./farmer.ts";

export interface Harvest
  extends Model<InferAttributes<Harvest>, InferCreationAttributes<Harvest>> {
  id: CreationOptional<number>;
  varietyId: number;
  fruitId: number;
  clientId: number;
  farmerId: number;
  farmId: number;
}

export const Harvest = sequelize.define<Harvest>("Harvest", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  varietyId: {
    type: DataTypes.INTEGER,
  },
  fruitId: {
    type: DataTypes.INTEGER,
  },
  clientId: {
    type: DataTypes.INTEGER,
  },
  farmerId: {
    type: DataTypes.INTEGER,
  },
  farmId: {
    type: DataTypes.INTEGER,
  },
});

// TODO: isnt there a less verbose way of doing this?

// Variety association

Harvest.belongsTo(Variety, {
  foreignKey: {
    allowNull: false,
    name: "varietyId",
  },
  as: "variety",
});

Variety.hasMany(Harvest, {
  foreignKey: {
    name: "varietyId",
  },
  as: "harvests",
});

// ------------------
// Fruit association

Harvest.belongsTo(Fruit, {
  foreignKey: {
    allowNull: false,
    name: "fruitId",
  },
  as: "fruit",
});

Fruit.hasMany(Harvest, {
  foreignKey: {
    name: "fruitId",
  },
  as: "harvests",
});

// ------------------
// Client association

Harvest.belongsTo(Client, {
  foreignKey: {
    allowNull: false,
    name: "clientId",
  },
  as: "client",
});

Client.hasMany(Harvest, {
  foreignKey: {
    name: "clientId",
  },
  as: "harvests",
});

// ------------------
// Farm association

Harvest.belongsTo(Farm, {
  foreignKey: {
    allowNull: false,
    name: "farmId",
  },
  as: "farm",
});

Farm.hasMany(Harvest, {
  foreignKey: {
    name: "farmId",
  },
  as: "harvests",
});

// ------------------
// Farmer association

Harvest.belongsTo(Farmer, {
  foreignKey: {
    allowNull: false,
    name: "farmerId",
  },
  as: "farmer",
});

Farmer.hasMany(Harvest, {
  foreignKey: {
    name: "farmerId",
  },
  as: "harvests",
});

// ------------------

await Harvest.sync();
