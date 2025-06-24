import sql from "../postgres";

export type SlotGame = {
  id: string;
  name: string;
}

export enum BetStatus {
  WIN,
  LOSS,
  PENDING,
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

export async function fetchRecentBetsByUser(userId: string, daysLimit: number) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - daysLimit);

  return await sql<Bet[]>`
    SELECT
      *
      FROM
      bets
      WHERE "userId" = ${userId}
      AND "createdAt" >= ${dateThreshold}
  `;
}
