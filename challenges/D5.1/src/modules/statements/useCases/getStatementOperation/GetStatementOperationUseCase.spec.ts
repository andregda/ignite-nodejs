import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it('should be able to fetch statement for a valid user', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Test',
      email: 'test@test.com',
      password: 'test',
    });

    const statement = await statementsRepositoryInMemory.create({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'Test',
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(statementOperation).toHaveProperty('id');
  });

  it('Should not be able to do a statement operation without statements ', async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: 'Test',
        email: 'test@test.com',
        password: 'test',
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'statement_id',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it('should not be able to fetch statement for a nonexistent user', async () => {
    expect(async () => {
      const statement = await statementsRepositoryInMemory.create({
        user_id: 'user_id',
        type: OperationType.DEPOSIT,
        amount: 100,
        description: 'Test',
      });

      await getStatementOperationUseCase.execute({
        user_id: 'user_id',
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});