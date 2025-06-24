import sql from "../postgres";

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: Date;
};

export async function getFakeAuthenticatedStaffMember() {
  const staff = await sql<StaffMember[]>`SELECT * FROM staff ORDER BY "createdAt" ASC`;
  return staff[0];
}
