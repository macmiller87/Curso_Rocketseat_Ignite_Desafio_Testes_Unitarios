import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      user_id
    }) =>
    {
      if (type === 'transfer') {
        return (
          {
            id,
            sender_id: user_id,
            amount: Number(amount),
            description,
            type,
            created_at,
            updated_at
          }
        )
      } else {
        return (
          {
            id,
            amount: Number(amount),
            description,
            type,
            created_at,
            updated_at
          }
        )
      }
    }
  );

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
