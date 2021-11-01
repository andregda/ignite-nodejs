import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('should be able to create a New User', () => {
  
  usersRepositoryInMemory = new InMemoryUsersRepository();
  createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

  it('should be able to create a New User', async () => {
    const user = await createUserUseCase.execute({
      name:'Test',
      email:'test@test',
      password:'testpass',
    })
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test');
  });
});