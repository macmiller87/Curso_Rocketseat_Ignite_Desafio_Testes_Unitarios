import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUserUseCase } from "./CreateTransferUserUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateTransferUserController {

  async execute(request: Request, response: Response) {

    const { id: user_id } = request.user;
    const { receive_userId } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransferUserUseCase = container.resolve(CreateTransferUserUseCase);

    const statement = await createTransferUserUseCase.execute({
      user_id,
      type,
      amount,
      description,
      receive_userId
    });

    return response.status(201).json(statement);
  }
}

