import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";

interface Farm
  extends Model<InferAttributes<Farm>, InferCreationAttributes<Farm>> {
  id: CreationOptional<number>;
  name: string;
  address: string;
}

export const Farm = sequelize.define<Farm>("Farm", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

await Farm.sync();
