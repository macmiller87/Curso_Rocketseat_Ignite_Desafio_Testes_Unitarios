import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import auth from "../../../../config/auth";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to make a deposit in an user account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Macmiller Duarte",
      email: "macamagolf@gmail.com",
      password: "8888"
    });

    auth.jwt.secret =  "8888";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "macamagolf@gmail.com",
      password: "8888"
    });

    const { token } = userToken.body;

    const responseToken = await request(app).post("/api/v1/statements/deposit").send({
      description: "Deposit Test",
      amount: 900,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseToken.status).toBe(201);
    expect(responseToken.body).toHaveProperty("id");
    expect(responseToken.body).toEqual(expect.objectContaining({
      description: responseToken.body.description,
      amount: responseToken.body.amount,
    })
    );

  });

  it("Should be able to withdraw credits from an user account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Macmiller",
      email: "teste@gmail.com",
      password: "6666"
    });

    auth.jwt.secret =  "6666";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@gmail.com",
      password: "6666"
    });

    const { token } = userToken.body;

    const userDepositToken = await request(app).post("/api/v1/statements/deposit").send({
      description: "Deposit Test",
      amount: 800,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const userWithdrawToken = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Withdraw Test",
      amount: 600,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(userWithdrawToken.status).toBe(201);
    expect(userWithdrawToken.body).toHaveProperty("id");
    expect(userWithdrawToken.body).toEqual(expect.objectContaining({
      description: userWithdrawToken.body.description,
      amount: userWithdrawToken.body.amount,
    })
    );

  });

  it("Should not be able to withdraw credits from an unexistent user and account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Fake Test",
      email: "teste@gmail.com",
      password: "4444"
    });

    auth.jwt.secret =  "4444";

    const userToken = "Fake Token";

    const userWithdrawToken = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Withdraw Test",
      amount: 400,
    }).set({
      Authorization: `Bearer ${userToken}`
    });

    expect(userWithdrawToken.status).toBe(401);
  });

  it("Should not be able to withdraw credits from an user account with insufficient balance", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Seu Madruga",
      email: "madruguinha@gmail.com",
      password: "2222"
    });

    auth.jwt.secret =  "2222";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "madruguinha@gmail.com",
      password: "2222"
    });

    const { token } = userToken.body;

    const userDepositToken = await request(app).post("/api/v1/statements/deposit").send({
      description: "Deposit Test",
      amount: 100,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const userWithdrawToken = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Withdraw Test",
      amount: 101,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(userWithdrawToken.status).toBe(400);

  });

});
