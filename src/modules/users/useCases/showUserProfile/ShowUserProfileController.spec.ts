import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import auth from "../../../../config/auth";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("ShowUserProfile Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should able to show a User profile", async () => {

    const user = await request(app).post("/api/v1/users").send({
      name: "Seu Madruga",
      email: "email@madruguinha.com",
      password: "8888"
    });

    auth.jwt.secret = "8888";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "email@madruguinha.com",
      password: "8888"
    });

    const { token } = userToken.body;

    const responseToken = await request(app).get("/api/v1/profile").send().set({
      Authorization: `Bearer ${token}`
    });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("id");
    expect(responseToken.body).toHaveProperty("name", responseToken.body.name);
    expect(responseToken.body).toHaveProperty("email", responseToken.body.email);
  });

  it("Should not able to show an profile User, if user nonexists", async () => {

    const userToken = "Fake Token";

    const responseToken = await request(app).get("/api/v1/profile").send().set({
      Authorization: `Bearer ${userToken}`
    });

    expect(responseToken.status).toBe(401);
  });
});
