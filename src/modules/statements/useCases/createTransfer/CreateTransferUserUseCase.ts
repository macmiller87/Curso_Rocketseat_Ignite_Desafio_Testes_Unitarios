import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

@injectable()
export class CreateTransferUserUseCase {

  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,
    @inject("StatementsRepository") private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, receive_userId }: ICreateStatementDTO) {

    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if(balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }

      const userReceive = await this.usersRepository.findById(receive_userId);

      if(!userReceive) {
        throw new CreateStatementError.ReceiverUserNotFound();
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      receive_userId: receive_userId
    });

    return statementOperation;
  }
}
