import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import auth from "../../../../config/auth";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Get Statement Operation Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able get an statement from an user account", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Chaves",
      email: "chavinho@gmail.com",
      password: "171"
    });

    auth.jwt.secret =  "171";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "chavinho@gmail.com",
      password: "171"
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

    const statement_id = userWithdrawToken.body.id;

    const UserStatementOperation = await request(app).get(`/api/v1/statements/${statement_id}`).send().set({
      Authorization: `Bearer ${token}`
    })

    expect(UserStatementOperation.body).toHaveProperty("user_id");
    expect(UserStatementOperation.body).toHaveProperty("id");
    expect(UserStatementOperation.body).toEqual(expect.objectContaining({
      description: UserStatementOperation.body.description,
      amount: UserStatementOperation.body.amount,
    })
    );

  });

  it("Should not able to get a Statement Operation, if User nonexistent", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Chaves",
      email: "chavinho@gmail.com",
      password: "171"
    });

    auth.jwt.secret =  "171";

    const statement_id = "Fake_statement_id";
    const token = "Fake Token";

    const UserStatementOperation = await request(app).get(`/api/v1/statements/${statement_id}`).send().set({
      Authorization: `Bearer ${token}`
    })

    expect(UserStatementOperation.status).toBe(401);
  });

  it("Should not able to get a Statement Operation, if nonexistent Statement", async () => {

    await request(app).post("/api/v1/users").send({
      name: "Severino",
      email: "zica@gmail.com",
      password: "171"
    });

    auth.jwt.secret =  "171";

    const userToken = await request(app).post("/api/v1/sessions").send({
      email: "zica@gmail.com",
      password: "171"
    });

    const { token } = userToken.body;
    const statement_id = "fea27d34-f621-4dc1-823d-423e348f142c";

    const UserStatementOperation = await request(app).get(`/api/v1/statements/${statement_id}`).send().set({
      Authorization: `Bearer ${token}`
    })

    expect(UserStatementOperation.status).toBe(404);
  });
  
});
