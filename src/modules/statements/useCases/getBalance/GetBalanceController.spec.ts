import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import auth from "../../../../config/auth";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Get Balance Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able get the balance from an user account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Macmiller",
      email: "teste@gmail.com",
      password: "4444"
    });

    auth.jwt.secret =  "4444";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@gmail.com",
      password: "4444"
    });

    const { token } = userToken.body;

    const userDepositToken = await request(app).post("/api/v1/statements/deposit").send({
      description: "Deposit Test",
      amount: 400,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const userWithdrawToken = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Withdraw Test",
      amount: 200,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const userBalance = await request(app).get("/api/v1/statements/balance").send().set({
      Authorization: `Bearer ${token}`
    });

    expect(userBalance.body).toHaveProperty("balance", 200);
  });

  it("Should not be able get the balance from an unexistent user account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Fake Test",
      email: "teste@gmail.com",
      password: "2222"
    });

    auth.jwt.secret =  "2222";

    const userToken = "Fake Token";

    const userBalance = await request(app).get("/api/v1/statements/balance").send().set({
      Authorization: `Bearer ${userToken}`
    });

    expect(userBalance.status).toBe(401);
  });
  
});
