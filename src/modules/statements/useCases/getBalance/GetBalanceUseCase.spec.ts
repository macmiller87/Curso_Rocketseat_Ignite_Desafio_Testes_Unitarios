import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("Should be able to get the Balance", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    const userDeposit = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: "Deposit test",
      amount: 1000,
      type: OperationType.DEPOSIT,
      receive_userId: ""
    });

    const userBalance = await getBalanceUseCase.execute({ user_id: userDeposit.user_id });

    expect(userBalance).toHaveProperty("balance");
    expect(userBalance).toHaveProperty("statement");
  });

  it("Should not able to get User balance, if User nonexistent", async () => {

    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "Fake id" });
    }).rejects.toBeInstanceOf(GetBalanceError);

  });

});
