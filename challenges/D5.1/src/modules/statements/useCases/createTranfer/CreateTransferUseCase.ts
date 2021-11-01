import { container, inject } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

interface IRequest {
  receiveUserId: string;
  senderUserId: string;
  amount: number;
  description: string;
}

class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute({
    receiveUserId,
    senderUserId,
    amount,
    description,
  }: IRequest) {
    if (amount <= 0) {
      throw new AppError("Amount must be greater than 0");
    }

    const receiveUser = await this.usersRepository.findById(receiveUserId);

    if (!receiveUser) {
      throw new AppError("Receive user not found");
    }

    const senderUser = await this.usersRepository.findById(senderUserId);

    if (!senderUser) {
      throw new AppError("Sender user not found");
    }

    const createStatementUseCase = container.resolve(CreateStatementUseCase);

    await createStatementUseCase.execute({
      amount: amount * -1,
      description,
      type: OperationType.TRANSFER,
      user_id: senderUser.id as string,
    });

    await createStatementUseCase.execute({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: receiveUser.id as string,
    });

    return {
      id: receiveUserId,
      sender_id: senderUserId,
      amount,
      description,
      type: OperationType.TRANSFER,
    };
  }
}

export { CreateTransferUseCase };
