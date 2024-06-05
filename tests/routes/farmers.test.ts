import request from "supertest";
import { app } from "../../src/app.ts";
import { Farmer } from "../../src/models/farmer.ts";

describe("POST /farmers", () => {
  it("returns the created farmer", async () => {
    const farmer = { name: "John", lastName: "Smith", email: "jsmith@eg.ma" };
    const response = request(app).post("/farmers").send(farmer);
    response.expect(201);

    const { body } = await response;
    expect(body.farmer.name).toBe(farmer.name);
  });
});

describe("GET /farmers", () => {
  describe("when there is at least one farmer", () => {
    const farmer = { name: "John", lastName: "Smith", email: "jsmith@eg.ma" };
    beforeEach(async () => {
      await Farmer.create(farmer);
    });

    it("returns all farmers", async () => {
      return request(app)
        .get("/farmers")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_farmers).toBe(1);
          expect(res.body.farmers[0].name).toBe(farmer.name);
          expect(res.body.farmers[0].lastName).toBe(farmer.lastName);
          expect(res.body.farmers[0].email).toBe(farmer.email);
        });
    });
  });
});
