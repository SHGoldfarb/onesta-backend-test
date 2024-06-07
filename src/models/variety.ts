import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.ts";

interface Variety
  extends Model<InferAttributes<Variety>, InferCreationAttributes<Variety>> {
  id: CreationOptional<number>;
  name: string;
}

export const Variety = sequelize.define<Variety>("Variety", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

await Variety.sync();
