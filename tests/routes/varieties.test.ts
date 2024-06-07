import request from "supertest";
import { app } from "../../src/app.ts";
import { Variety } from "../../src/models/variety.ts";

describe("POST /varieties", () => {
  it("returns the created variety", async () => {
    const variety = { name: "Large" };
    const response = request(app).post("/varieties").send(variety);
    response.expect(201);

    const { body } = await response;
    expect(body.variety.name).toBe(variety.name);
  });

  describe("when the name is already in use", () => {
    it("returns correct error code and message", async () => {
      const variety = { name: "Large" };
      await Variety.create(variety);
      const response = request(app).post("/varieties").send(variety);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("name must be unique");
    });
  });

  describe("when attributes are missing", () => {
    it("returns correct error code and message", async () => {
      // Name
      const response = request(app).post("/varieties").send({});
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Variety.name cannot be null");
    });
  });
});

describe("GET /varieties", () => {
  describe("when there is at least one variety", () => {
    const variety = { name: "Large" };
    beforeEach(async () => {
      await Variety.create(variety);
    });

    it("returns all varieties", async () => {
      return request(app)
        .get("/varieties")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_varieties).toBe(1);
          expect(res.body.varieties[0].name).toBe(variety.name);
        });
    });
  });
});
