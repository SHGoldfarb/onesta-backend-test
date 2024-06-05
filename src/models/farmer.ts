import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";

interface Farmer
  extends Model<InferAttributes<Farmer>, InferCreationAttributes<Farmer>> {
  id: CreationOptional<number>;
  name: string;
  lastName: string;
  email: string;
}

export const Farmer = sequelize.define<Farmer>("Farmer", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

await Farmer.sync();
