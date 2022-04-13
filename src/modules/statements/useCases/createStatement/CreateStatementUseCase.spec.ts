import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to do a Deposit", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    const userDeposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "Deposit test",
      amount: 2000,
      type: OperationType.DEPOSIT
    });

    expect(userDeposit).toHaveProperty("id");
    expect(userDeposit).toEqual(expect.objectContaining({
        user_id: userDeposit.user_id,
        description: userDeposit.description,
        amount: userDeposit.amount,
        type: userDeposit.type
      })
    );
  });

  it("Should be able to do a withdraw", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "Deposit test",
      amount: 2000,
      type: OperationType.DEPOSIT
    });

    const userWithdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "Withdraw test",
      amount: 1000,
      type: OperationType.WITHDRAW
    });

    expect(userWithdraw).toHaveProperty("id");
  });

  it("Should not be able to do a statement with nonexistent User", async () => {

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "User Fake",
        description: "Withdraw test",
        amount: 1000,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);

  });

  it("Should not be able to do a withdraw with insufficient balance", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "Deposit test",
      amount: 1000,
      type: OperationType.DEPOSIT
    });

    await expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        description: "Withdraw test",
        amount: 1001,
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

  });

});


