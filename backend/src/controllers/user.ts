import { Request, Response, NextFunction } from "express";
import {
  fetchUserByIdWithBalanceDetails,
  fetchUsers,
  fetchUsersCount,
  User,
} from "../models/user";

type ListUsersQuery = {
  limit: string;
  page: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type ListUsersResponse = {
  users: User[];
  count: number;
  total: number;
  currentPage: number;
  prevPage: number | undefined;
  nextPage: number | undefined;
};

const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 3;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc";

export async function listUsers(
  req: Request<{}, ListUsersResponse, {}, ListUsersQuery>,
  res: Response<ListUsersResponse>,
  next: NextFunction
) {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;

    const currentPage = page ? parseInt(page) : DEFAULT_PAGE;
    const limitNumber = limit ? parseInt(limit) : DEFAULT_LIMIT;
    const offset = currentPage * limitNumber;

    const [totalRecords, users] = await Promise.all([
      fetchUsersCount(),
      fetchUsers({
        limit: limitNumber,
        offset: offset,
        sortBy: sortBy || DEFAULT_SORT_BY,
        sortOrder: sortOrder || DEFAULT_SORT_ORDER,
      }),
    ]);

    res.json({
      users,
      count: users.length,
      total: totalRecords,
      currentPage,
      prevPage: currentPage > 0 ? currentPage - 1 : undefined,
      nextPage:
        offset + users.length < totalRecords ? currentPage + 1 : undefined,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

type GetUserParams = {
  userId: string;
};

type GetUserResponse = User;

export async function getUser(
  req: Request<GetUserParams, GetUserResponse, {}, {}>,
  res: Response<GetUserResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const user = await fetchUserByIdWithBalanceDetails(userId);
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
