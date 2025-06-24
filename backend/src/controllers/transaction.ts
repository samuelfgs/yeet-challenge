import { Request, Response, NextFunction } from "express";
import { v4 as uuid} from "uuid";
import {
  fetchTransactionCountByUser,
  fetchUserTransactions,
  insertNewTransaction,
  Transaction,
  TransactionType,
} from "../models/transaction";
import { getFakeAuthenticatedStaffMember } from "../models/staff";

type ListTransactionsParams = {
  userId: string;
};

type ListTransactionsQuery = {
  limit?: string;
  page?: string;
};

type ListTransactionsResponse = {
  transactions: Transaction[];
  count: number;
  total: number;
  currentPage: number;
  prevPage: number | undefined;
  nextPage: number | undefined;
};

export async function listUserTransactions(
  req: Request<
    ListTransactionsParams,
    ListTransactionsResponse,
    {},
    ListTransactionsQuery
  >,
  res: Response<ListTransactionsResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const currentPage = page ? parseInt(page) : 0;
    const limitNumber = limit ? parseInt(limit) : 20;
    const offset = currentPage * limitNumber;

    const [totalRecords, transactions] = await Promise.all([
      fetchTransactionCountByUser(userId),
      fetchUserTransactions({
        userId,
        offset,
        limit: limitNumber,
      }),
    ]);

    res.json({
      transactions,
      count: transactions.length,
      total: totalRecords,
      currentPage,
      prevPage: currentPage > 0 ? currentPage - 1 : undefined,
      nextPage:
        offset + transactions.length < totalRecords
          ? currentPage + 1
          : undefined,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

type AdjustUserBalanceBody = {
  userId: string;
  amount: number;
  type: "credit" | "debit";
  comment?: string;
};

export async function adjustUserBalance(
  req: Request<{}, {}, AdjustUserBalanceBody, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, amount, type, comment } = req.body;

    if (type === "debit" && amount >= 0) {
      res.status(400).json({error: "Debit should be negative"})
      return;
    } else if (type === "credit" && amount <= 0) {
      res.status(400).json({error: "Credit should be positive"})
      return;
    }

    const employee = await getFakeAuthenticatedStaffMember();

    const transaction: Transaction = {
      id: uuid(),
      userId,
      employeeId: employee.id,
      amount,
      createdAt: new Date(Date.now()),
      transactionType:
        type === "credit"
          ? TransactionType.BONUS
          : TransactionType.MANUAL_DEBIT,
      comment: comment ?? null,
    };

    await insertNewTransaction(transaction);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
