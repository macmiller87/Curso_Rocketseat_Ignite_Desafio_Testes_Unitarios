import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {

    const user = await request(app).post("/api/v1/users").send({
      name: "Macmiller Duarte",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    expect(user.status).toBe(201);
  });

  it("should not be able to create a User if the Email is already in use", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "eamil@teste.com",
      password: "5678"
    });

    const user = await request(app).post("/api/v1/users").send({
      name: "User Test 2",
      email: "eamil@teste.com",
      password: "5678"
    });

    expect(user.status).toBe(400);
  });
});
