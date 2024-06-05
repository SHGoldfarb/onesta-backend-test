import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Fruit = sequelize.define("Fruit", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Fruit.sync();
