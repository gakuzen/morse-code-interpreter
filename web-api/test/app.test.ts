import request from "supertest";
import app from "../src/app";

describe("GET /random-url", (): void => {
  it("should return 404", (done): void => {
    request(app).get("/reset").expect(404, done);
  });
});
