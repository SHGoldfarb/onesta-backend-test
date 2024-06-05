import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: process.env.LOG_SQL === "true",
});

try {
  await sequelize.authenticate();
  if (process.env.NODE_ENV !== "test") {
    console.log("Database connection has been established successfully.");
  }
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
