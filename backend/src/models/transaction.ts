import sql from "../postgres";
import { fetchUserByid } from "./user";

export enum TransactionType {
  DEPOSIT = 1,
  WITHDRAW = 2,
  BONUS = 3,
  MANUAL_DEBIT = 4,
}

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  transactionType: TransactionType;
  employeeId?: string;
  comment?: string | null;
};

export async function fetchUserTransactions({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number | undefined;
}) {
  return await sql<Transaction[]>`
    SELECT
      *
      FROM
      transactions
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT ${limit} ${offset ? sql`OFFSET ${offset}` : sql``}
  `;
}

export async function fetchTransactionCountByUser(userId: string) {
  const result =
    await sql`SELECT COUNT(*) FROM transactions WHERE "userId" = ${userId}`;
  return +result[0].count;
}

export async function insertNewTransaction(transaction: Transaction) {
  const user = await fetchUserByid(transaction.userId);

  if (user.accountBalance + transaction.amount < 0) {
    throw new Error("Invalid transcation");
  }

  await sql.begin(async transactionSql => {
    await transactionSql`
      INSERT 
        INTO transactions ${transactionSql(
          transaction,
          "id",
          "userId",
          "amount",
          "createdAt",
          "transactionType",
          "employeeId",
          "comment"
        )}
    `;
    await transactionSql`
      UPDATE 
        users SET ${transactionSql({accountBalance: user.accountBalance + transaction.amount}, 'accountBalance')} 
        WHERE id = ${user.id}`;
  });
  
}
