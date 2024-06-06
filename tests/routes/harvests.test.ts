import request from "supertest";
import { app } from "../../src/app.ts";
import { Harvest } from "../../src/models/harvest.ts";
import { Fruit } from "../../src/models/fruit.ts";
import { Variety } from "../../src/models/variety.ts";
import { Client } from "../../src/models/client.ts";
import { Farm } from "../../src/models/farm.ts";
import { Farmer } from "../../src/models/farmer.ts";

const setupOtherEntities = async () => ({
  fruitId: (await Fruit.create({ name: "Apple" })).id,
  varietyId: (await Variety.create({ name: "Large" })).id,
  clientId: (
    await Client.create({
      name: "John",
      lastName: "Smith",
      email: "jsmith@ee.gg",
    })
  ).id,
  farmId: (await Farm.create({ name: "Oakfield", address: "1212 Oak st" })).id,
  farmerId: (
    await Farmer.create({
      name: "John",
      lastName: "Smith",
      email: "jsmith@ee.gg",
    })
  ).id,
});

describe("POST /harvests", () => {
  it("returns the created harvest", async () => {
    const response = request(app)
      .post("/harvests")
      .send(await setupOtherEntities());
    response.expect(201);

    const { body } = await response;
    expect(body.harvest).toBeTruthy();
  });
});

describe("GET /harvests", () => {
  describe("when there is at least one harvest", () => {
    beforeEach(async () => {
      await Harvest.create(await setupOtherEntities());
    });

    it("returns all harvests", async () => {
      return request(app)
        .get("/harvests")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_harvests).toBe(1);
          expect(res.body.harvests[0]).toBeTruthy();
        });
    });
  });
});

describe("POST /harvests/bulk", () => {
  it("returns the created harvests", async () => {
    const response = request(app)
      .post("/harvests/bulk")
      .send({ csvPath: "./tests/resources/cosechas_ok.csv" });
    response.expect(201);

    const { body } = await response;

    console.log(body);

    expect(body.total_created).toBeTruthy();
    expect(body.harvests[0].id).toBeTruthy();
  });
});
