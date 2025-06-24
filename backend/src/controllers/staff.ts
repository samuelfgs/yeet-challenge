import { Request, Response, NextFunction } from "express";
import { getFakeAuthenticatedStaffMember, StaffMember } from "../models/staff";

type GetLoggedInStaffMember = StaffMember;

export async function getLoggedInStaffMember(
  req: Request<{}, GetLoggedInStaffMember, {}, {}>,
  res: Response<GetLoggedInStaffMember>,
  next: NextFunction
) {
  try {
    res.json(await getFakeAuthenticatedStaffMember());
  } catch (error) {
    console.error(error);
    next(error);
  }
}
