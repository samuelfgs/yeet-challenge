import { Request, Response, NextFunction } from "express";
import { Bet, fetchRecentBetsByUser } from "../models/bet";

type GetRecentBetsParams = {
  userId: string;
};

type GetRecentBetsQuery = {
  daysLimit: string;
};

type GetRecentBetsResponse = Bet[];

export async function getRecentBetsForUser(
  req: Request<
    GetRecentBetsParams,
    GetRecentBetsResponse,
    {},
    GetRecentBetsQuery
  >,
  res: Response<GetRecentBetsResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { daysLimit } = req.query;

    const bets = await fetchRecentBetsByUser(userId, parseInt(daysLimit));
    res.json(bets);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
