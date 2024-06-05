import { sequelize } from "../src/database/database.ts";

afterEach(async () => {
  // Reset database after each test
  await sequelize.sync({ force: true });
});
