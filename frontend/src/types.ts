export enum BetStatus {
  WIN = 1,
  LOSS = 2,
  PENDING = 3,
}

export type Bet = {
  id: string;
  userId: string;
  slotGameId: string;
  wagerAmount: number;
  multiplier: number;
  status: BetStatus;
  createdAt: Date;
};

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: Date;
};

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

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  accountBalance: number;
  lastLogin?: Date;
  lastTransaction?: Date;
  lastBet?: Date;
  createdAt: Date;
};

export type ListUsersResponse = {
  users: (User & { totalWagerAmount: number })[];
  count: number;
  total: number;
  currentPage: number;
  prevPage?: number;
  nextPage?: number;
}

export type GetUserTransactionsResponse = {
  transactions: Transaction[];
  count: number;
  total: number;
  currentPage: number;
  prevPage?: number;
  nextPage?: number;
}

export type GetRecentBetsResponse = Bet[];

export type GetUserByIdResponse = User & {
  depositAmount: number;
  withdrawAmount: number;
}