import request from "supertest";
import { app } from "../../src/app.ts";
import { Fruit } from "../../src/models/fruit.ts";
import { Variety } from "../../src/models/variety.ts";

describe("POST /fruits", () => {
  it("returns the created fruit", async () => {
    const variety = await Variety.create({ name: "Large" });
    const fruit = { name: "Apple", varietyId: variety.id };
    const response = request(app).post("/fruits").send(fruit);
    response.expect(201);

    const { body } = await response;
    expect(body.fruit.name).toBe(fruit.name);
  });

  describe("when no variety is specified", () => {
    it("returns correct error code and message", async () => {
      const fruit = { name: "Apple" };
      const response = request(app).post("/fruits").send(fruit);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Variety doesn't exist");
    });
  });

  describe("when variety doesnt exist", () => {
    it("returns correct error code and message", async () => {
      const fruit = { name: "Apple", varietyId: 10 };
      const response = request(app).post("/fruits").send(fruit);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Variety doesn't exist");
    });
  });
});

describe("GET /fruits", () => {
  describe("when there is at least one fruit", () => {
    const fruit = { name: "Apple" };
    beforeEach(async () => {
      const variety = await Variety.create({ name: "Large" });
      await Fruit.create({ ...fruit, varietyId: variety.id });
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
