import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.js";
import { Variety } from "./variety.ts";

interface Fruit
  extends Model<InferAttributes<Fruit>, InferCreationAttributes<Fruit>> {
  id: CreationOptional<number>;
  name: string;
  varietyId: number;
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
  },
  varietyId: {
    type: DataTypes.INTEGER,
  },
});

Fruit.belongsTo(Variety, {
  foreignKey: {
    allowNull: false,
    name: "varietyId",
  },
  as: "variety",
});

Variety.hasMany(Fruit, {
  foreignKey: {
    name: "varietyId",
  },
  as: "fruits",
});

await Fruit.sync();
