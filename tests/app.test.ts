import request from "supertest";
import { app } from "../src/app.ts";

describe("GET /fruits", () => {
  it("should return all fruits", async () => {
    return request(app)
      .get("/fruits")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.total_fruits).toBe(0);
      });
  });
});
