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

  describe("when attributes are missing", () => {
    it("returns correct error code and message", async () => {
      // fruitId
      // varietyId
      // clientId
      // farmId
      // farmerId
      const response = request(app).post("/harvests").send({});
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe(
        "Harvest.varietyId cannot be null\nHarvest.fruitId cannot be null\nHarvest.clientId cannot be null\nHarvest.farmerId cannot be null\nHarvest.farmId cannot be null",
      );
    });
  });

  describe("when some ids are incorrect", () => {
    it("returns correct error code and message", async () => {
      const fruit = await Fruit.create({ name: "Apple" });

      const response = request(app).post("/harvests").send({
        fruitId: fruit.id,
        varietyId: 99,
        clientId: 99,
        farmId: 99,
        farmerId: 99,
      });
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe(
        "variety doesn't exist\nclient doesn't exist\nfarmer doesn't exist\nfarm doesn't exist",
      );
    });
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

    expect(body.total_created).toBeTruthy();
    expect(body.harvests[0].id).toBeTruthy();
  });

  describe("when there are errors in creation", () => {
    // Bad format
    // Client: different names, same email
    // Farmer: different names, same email
    // Farm: dirrerent address, same name
    it.todo("correctly returns created harvests and errored lines");
  });
});
