import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index";
import { app } from "../../../../app";
import auth from "../../../../config/auth";

let connection: Connection;

describe("Authenticate User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to Aunthenticate a User", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Chapolim",
      email: "email@chaves.com",
      password: "8899"
    });

    auth.jwt.secret = "8899";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "email@chaves.com",
      password: "8899"
    });

    expect(userToken.body.user).toHaveProperty("email", "email@chaves.com");
    expect(userToken.body).toHaveProperty("token");
    expect(userToken.status).toBe(200);
  });

  it("Should not be able authenticate an unexistent User", async () => {

    const user = await request(app).post("/api/v1/sessions").send({
      email: "fake@email.com",
      password: "8899"
    });

    expect(user.status).toBe(401);
  });

  it("Should not able authenticate an User with incorrect password", async () => {

    await request(app).post("/api/v1/users").send({
      name: "KIKO",
      email: "tesouro@email.com",
      password: "6969"
    });

    auth.jwt.secret = "6969";

    const user = await request(app).post("/api/v1/sessions").send({
      email: "tesouro@email.com",
      password: "incorrect password"
    });

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty('message');
  });

  it("Should not able authenticate an User with incorrect email", async () => {

    await request(app).post("/api/v1/users").send({
      name: "KIKO",
      email: "tesouro@email.com",
      password: "6688"
    });

    auth.jwt.secret = "6688";

    const user = await request(app).post("/api/v1/sessions").send({
      email: "fake@email.com",
      password: "6688"
    });

    expect(user.status).toBe(401);
    expect(user.body).toHaveProperty('message');
  });

});
