import sql from "../postgres";

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  accountBalance: number;
  lastLogin?: Date | null;
  lastTransaction?: Date | null;
  lastBet?: Date | null;
  createdAt: Date;
};

export async function fetchUsers({
  limit,
  offset,
  sortBy,
  sortOrder,
}: {
  limit: number;
  offset: number | undefined;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  const users = await sql<User[]>`
    SELECT
      users.*,
      SUM(bets."wagerAmount") as "totalWagerAmount"
      FROM
        users
      INNER JOIN
        bets ON users.id = bets."userId"
      WHERE
        bets."createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY
        users.id
      ORDER BY ${sql(sortBy)} ${sortOrder === "asc" ? sql`asc` : sql`desc`}
      LIMIT ${limit} ${offset ? sql`OFFSET ${offset}` : sql``}
  `;

  return users;
}

export async function fetchUsersCount() {
  const result = await sql`SELECT COUNT(*) FROM users`;
  return +result[0].count;
}

export async function fetchUserByIdWithBalanceDetails(id: string) {
  const users = await sql<User[]>`
    SELECT 
      users.*,
      CAST(SUM(CASE WHEN t."transactionType" = 1 THEN t.amount ELSE 0 END) AS INT) AS "depositAmount",
      CAST(SUM(CASE WHEN t."transactionType" = 2 THEN t.amount ELSE 0 END) AS INT) AS "withdrawAmount"
      FROM users
      INNER JOIN
        transactions AS t ON users.id = t."userId"
      WHERE 
        users.id = ${id}
      GROUP BY
        users.id

  `;

  if (users.length === 0) {
    throw new Error("User not found");
  }
  return users[0];
}

export async function fetchUserByid(id: string) {
  const users = await sql<User[]>`
    SELECT 
      *
      FROM users
      WHERE id = ${id}
  `;

  if (users.length === 0) {
    throw new Error("User not found");
  }
  return users[0];
}