import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { listUsers, getUser } from "./controllers/user";
import {
  adjustUserBalance,
  listUserTransactions,
} from "./controllers/transaction";
import { getRecentBetsForUser } from "./controllers/bet";
import { getLoggedInStaffMember } from "./controllers/staff";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/api/users", listUsers);
app.get("/api/users/:userId", getUser);
app.get("/api/users/:userId/transactions", listUserTransactions);
app.get("/api/users/:userId/recent-bets", getRecentBetsForUser);

app.get("/api/admin/logged-in", getLoggedInStaffMember);
app.post("/api/admin/adjust-user-balance", adjustUserBalance);

export default app;
