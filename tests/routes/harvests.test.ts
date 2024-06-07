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

  describe("when csv has bad format", () => {
    it("correctly returns error code and errored line", async () => {
      const response = request(app)
        .post("/harvests/bulk")
        .send({ csvPath: "./tests/resources/cosechas_bad_format.csv" });
      response.expect(400);

      const { body } = await response;

      expect(body.total_created).toBe(0);

      // Bad format
      expect(body.error).toContain(
        "Invalid Record Length: expect 10, got 3 on line 3",
      );
    });
  });

  describe("when the csv has attribute inconsistencies", () => {
    it("correctly returns created harvests and errored lines", async () => {
      const response = request(app)
        .post("/harvests/bulk")
        .send({ csvPath: "./tests/resources/cosechas_dirty.csv" });
      response.expect(400);

      const { body } = await response;

      expect(body.total_created).toBe(53);
      expect(body.harvests[0].id).toBeTruthy();
      // Client: different names, same email
      expect(body.error).toContain(
        "client has attributes inconsistent with database",
      );
      // Farmer: different names, same email
      expect(body.error).toContain(
        "farmer has attributes inconsistent with database",
      );
      // Farm: dirrerent address, same name
      expect(body.error).toContain(
        "farm has attributes inconsistent with database",
      );
      // Empty fields
      expect(body.error).toContain("Validation notEmpty on email failed");
    });
  });

  it("correctly creates or reuses data", async () => {
    const response = request(app)
      .post("/harvests/bulk")
      .send({ csvPath: "./tests/resources/cosechas_repeated.csv" });
    response.expect(201);

    await response;

    // Creates correct number of clients
    expect((await Client.findAll()).length).toBe(1);
    // Creates correct number of farmers
    expect((await Farmer.findAll()).length).toBe(1);
    // Creates correct number of farms
    expect((await Farm.findAll()).length).toBe(1);
    // Creates correct number of fruits
    expect((await Fruit.findAll()).length).toBe(1);
    // Creates correct number of varieties
    expect((await Variety.findAll()).length).toBe(1);
  });
});
