import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";

interface Fruit
  extends Model<InferAttributes<Fruit>, InferCreationAttributes<Fruit>> {
  id: CreationOptional<number>;
  name: string;
}

export const Fruit = sequelize.define<Fruit>("Fruit", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

await Fruit.sync();
