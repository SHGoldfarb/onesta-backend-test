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
  email: string;
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

await Client.sync();
