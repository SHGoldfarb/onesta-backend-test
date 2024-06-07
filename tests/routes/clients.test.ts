import request from "supertest";
import { app } from "../../src/app.ts";
import { Client } from "../../src/models/client.ts";

describe("POST /clients", () => {
  it("returns the created client", async () => {
    const client = { name: "John", lastName: "Smith", email: "jsmith@eg.ma" };
    const response = request(app).post("/clients").send(client);
    response.expect(201);

    const { body } = await response;
    expect(body.client.name).toBe(client.name);
  });

  describe("when the email is already in use", () => {
    it("returns correct error code and message", async () => {
      const client = { name: "John", lastName: "Smith", email: "jsmith@eg.ma" };
      await Client.create(client);
      const response = request(app).post("/clients").send(client);
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("email must be unique");
    });
  });

  describe("when attributes are missing", () => {
    it("returns correct error code and message", async () => {
      // Name
      // Lastname
      // email
      const response = request(app).post("/clients").send({});
      response.expect(400);

      const { body } = await response;
      expect(body.error).toBe("Client.email cannot be null");
    });
  });
});

describe("GET /clients", () => {
  describe("when there is at least one client", () => {
    const client = { name: "John", lastName: "Smith", email: "jsmith@eg.ma" };
    beforeEach(async () => {
      await Client.create(client);
    });

    it("returns all clients", async () => {
      return request(app)
        .get("/clients")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.total_clients).toBe(1);
          expect(res.body.clients[0].name).toBe(client.name);
          expect(res.body.clients[0].lastName).toBe(client.lastName);
          expect(res.body.clients[0].email).toBe(client.email);
        });
    });
  });
});
