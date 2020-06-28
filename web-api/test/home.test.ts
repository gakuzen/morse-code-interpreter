import request from "supertest";
import app from "../src/app";

describe("GET /", (): void => {
  it("should return 200 OK", (done): void => {
    request(app).get("/").expect(200, done);
  });
});
