import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = await usersRepositoryInMemory.create({
      email: 'user@test.com',
      password: '11111',
      name: 'User',
    });
    
    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with invalid password', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: 'user@test.com',
        password: '123456',
        name: 'User',
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '12345',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
  
  it('should not be able to authenticate a non user exist', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});