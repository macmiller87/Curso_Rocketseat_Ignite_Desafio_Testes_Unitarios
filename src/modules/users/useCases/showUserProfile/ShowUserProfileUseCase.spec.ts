import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Should user profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should able to show a User profile", async () => {

    const user = await createUserUseCase.execute({
      name: "Macmiller Duarte",
      email: "macamagolf@gmail.com",
      password: "1234"
    });

    if(user.id) {
      const profileUser = await showUserProfileUseCase.execute(user.id);

      expect(profileUser).toHaveProperty("id");
    }

  });

  it("Should not able to show an profile User, if user nonexists", async () => {

    expect(async () => {
      await showUserProfileUseCase.execute("fake_id");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

});
