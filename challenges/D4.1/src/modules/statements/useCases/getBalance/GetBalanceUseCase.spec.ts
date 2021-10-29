import { GetBalanceError } from "./GetBalanceError";
import 'reflect-metadata'
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("should be able to get user's balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "Test",
      email: "test@test.com",
      password: "test",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });

  it("should not be able to get balance for a nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});