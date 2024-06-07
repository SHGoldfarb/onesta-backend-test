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
    it.todo("returns correct error code and message");
  });

  describe("when attributes are missing", () => {
    // name
    it.todo("returns correct error code and message");
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
