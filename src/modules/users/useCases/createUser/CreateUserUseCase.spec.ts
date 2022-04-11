import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new User", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller",
      email: "email@test.com",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should be not able to create a new User with the same email", async () =>{

    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Macmiller",
        email: "macamagolf@gmail.com",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  });

});


