import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it('should be able to show a User', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Jest Test',
      email: 'test@jest.com',
      password: 'admin',
    });

    const profile = await showUserProfileUseCase.execute(String(user.id));

    expect(profile).toHaveProperty('id');
    expect(profile.name).toBe('Jest Test');
  });

  it('should not be able to show a nonexistent User', async () => {
    expect(async () => {
      const profile = await showUserProfileUseCase.execute('Not a User');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
