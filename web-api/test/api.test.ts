import request from "supertest";
import app from "../src/app";

describe("GET /api", (): void => {
  it("should return 200 OK", (): void => {
    request(app).get("/api").expect(200);
  });
});
