import { send } from "process";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

let createTransferUseCase: CreateTransferUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create Tranfer", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createTransferUseCase = new CreateTransferUseCase(usersRepositoryInMemory);
  });

  it("should be able to tranfer from sender to receiver user.", () => {
    expect(async () => {
      const sender = await usersRepositoryInMemory.create({
        name: 'TestSender',
        email: 'sender@test.com',
        password: 'sender',
      });

      expect(sender.name).toBe('TestSender');

      const receiver = await usersRepositoryInMemory.create({
        name: 'TestReceiver',
        email: 'receiver@test.com',
        password: 'receiver',
      });

      expect(receiver.name).toBe('TestReceiver');

      const transfer = await createTransferUseCase.execute({
        receiveUserId: sender.id as string,
        senderUserId: receiver.id as string,
        amount: 100,
        description: 'Some Test Transfer Description',
      })

      expect(transfer.type).toBe('transfer');
      expect(transfer.amount).toBe(100);

    });
  });
});
