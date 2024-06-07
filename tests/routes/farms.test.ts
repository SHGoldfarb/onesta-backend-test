import request from "supertest";
import { app } from "../../src/app.ts";
import { Farm } from "../../src/models/farm.ts";

describe("POST /farms", () => {
  it("returns the created farm", async () => {
    const farm = { name: "John", address: "2928 willow st" };
    const response = request(app).post("/farms").send(farm);
    response.expect(201);

    const { body } = await response;
    expect(body.farm.name).toBe(farm.name);
  });

  describe("when the name is already in use", () => {
    it("returns correct error code and message", async () => {
      const farm = { name: "Yellowgrass", address: "1234 willow st" };
      await Farm.create(farm);
      const response = request(app).post("/farms").send(farm);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("name must be unique");
    });
  });

  describe("when attributes are missing", () => {
    it("returns correct error code and message", async () => {
      // Name
      // Address
      const response = request(app).post("/farms").send({});
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Farm.name cannot be null");
    });
  });
});

describe("GET /farms", () => {
  describe("when there is at least one farm", () => {
    const farm = { name: "John", address: "2928 willow st" };
    beforeEach(async () => {
      await Farm.create(farm);
    });

    it("returns all farms", async () => {
      return request(app)
        .get("/farms")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_farms).toBe(1);
          expect(res.body.farms[0].name).toBe(farm.name);
          expect(res.body.farms[0].address).toBe(farm.address);
        });
    });
  });
});
