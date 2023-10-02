const request = require("supertest");

const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test Get /planets", () => {
    test("it should respond with 200 success", async () => {
      const response = await request(app)
        .get("/planets")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  
});
