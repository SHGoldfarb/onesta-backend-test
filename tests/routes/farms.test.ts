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

  describe("when attributes are missing", () => {
    // Name
    // Address
    it.todo("returns correct error code and message");
  });

  describe("when the name is already in use", () => {
    it.todo("returns correct error code and message");
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
