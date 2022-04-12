import auth from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticated User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should able to authenticate an User", async () => {

    const user: ICreateUserDTO = {
      name: "Macmiller",
      email: "email@test.com",
      password: "1234",
    };

    auth.jwt.secret = user.password;

    await createUserUseCase.execute(user);

    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuthenticate.user).toHaveProperty("email", user.email);
    expect(userAuthenticate).toHaveProperty("token");

  });

  it("Should not be able authenticate an unexistent User", () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it("Should not able authenticate an User with incorrect password", async () => {

    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Macmiller",
        email: "email@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});
