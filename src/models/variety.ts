import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Variety = sequelize.define("Variety", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

await Variety.sync();
