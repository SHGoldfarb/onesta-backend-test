import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";

interface Client
  extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
  id: CreationOptional<number>;
  name: string;
  lastName: string;
}

export const Client = sequelize.define<Client>("Client", {
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
});

await Client.sync();