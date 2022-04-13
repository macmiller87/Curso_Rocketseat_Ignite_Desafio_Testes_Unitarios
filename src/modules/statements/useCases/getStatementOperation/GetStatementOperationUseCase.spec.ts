import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to get a Statement Operation", async () => {

    const user = await createUserUseCase.execute({
      name: "Chapolim",
      email: "email@fake.com",
      password: "45678"
    });

    const userDeposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "Deposit Test",
      amount: 800,
      type: OperationType.DEPOSIT
    });

    const getUserStatementOperation = await getStatementOperationUseCase.execute({
      user_id: userDeposit.user_id,
      statement_id: userDeposit.id as string
    });

    expect(getUserStatementOperation).toHaveProperty("user_id");
    expect(getUserStatementOperation).toHaveProperty("id");
    expect(getUserStatementOperation.description).toEqual("Deposit Test");
    expect(getUserStatementOperation.amount).toEqual(800);
  });

  it("Should not able to get a Statement Operation, if User nonexistent", async () => {

    await expect(async () => {

      const user = await createUserUseCase.execute({
        name: "Chapolim",
        email: "email@fake.com",
        password: "45678"
      });

      const userDeposit = await createStatementUseCase.execute({
        user_id: user.id as string,
        description: "Deposit Test",
        amount: 100,
        type: OperationType.DEPOSIT
      });

      const getUserStatementOperation = await getStatementOperationUseCase.execute({
        user_id: userDeposit.user_id,
        statement_id: userDeposit.id as string
      });

      await getStatementOperationUseCase.execute({ user_id: "User Fake", statement_id: getUserStatementOperation.id as string });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not able to get a Statement Operation, if nonexistent Statement", async () => {

    await expect(async () => {

      const user = await createUserUseCase.execute({
        name: "Kiko",
        email: "teste@emailfake.com",
        password: "1234"
      });

      const userDeposit = await createStatementUseCase.execute({
        user_id: user.id as string,
        description: "Deposit Test",
        amount: 600,
        type: OperationType.DEPOSIT
      });

      const getUserStatementOperation = await getStatementOperationUseCase.execute({
        user_id: userDeposit.user_id,
        statement_id: userDeposit.id as string
      });

      const teste = await getStatementOperationUseCase.execute({ user_id: getUserStatementOperation.user_id, statement_id: "Statement Fake" });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});
