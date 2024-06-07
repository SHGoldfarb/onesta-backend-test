import request from "supertest";
import { app } from "../../src/app.ts";
import { Fruit } from "../../src/models/fruit.ts";

describe("POST /fruits", () => {
  it("returns the created fruit", async () => {
    const fruit = { name: "Apple" };
    const response = request(app).post("/fruits").send(fruit);
    response.expect(201);

    const { body } = await response;
    expect(body.fruit.name).toBe(fruit.name);
  });

  describe("when the name is already in use", () => {
    it("returns correct error code and message", async () => {
      const fruit = { name: "Apple" };
      await Fruit.create(fruit);
      const response = request(app).post("/fruits").send(fruit);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("name must be unique");
    });
  });

  describe("when attributes are missing", () => {
    it("returns correct error code and message", async () => {
      // Name
      const response = request(app).post("/fruits").send({});
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Fruit.name cannot be null");
    });
  });
});

describe("GET /fruits", () => {
  describe("when there is at least one fruit", () => {
    const fruit = { name: "Apple" };
    beforeEach(async () => {
      await Fruit.create({ ...fruit });
    });

    it("returns all fruits", async () => {
      return request(app)
        .get("/fruits")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_fruits).toBe(1);
          expect(res.body.fruits[0].name).toBe(fruit.name);
        });
    });
  });
});
