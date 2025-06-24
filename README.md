## VIP Admin Dashboard Challenge

For this challenge, I have created an admin dashboard to help Yeet employees to give support to our VIP users.

The following features are available.

- List of users in the homepage with pagination and sort by option
- Ability to add a credit or a debit to the users account
- Bonus: User detail view
  - List of transactions per users
  - Statistics for recent bets from an user

## Stack and external libraries

- **Backend**: Node.js with Express
- **Frontend** React.js

- `@tanstack/react-query`: used to fetch data from the backend and manage loading and error states efficiently.
- `@mui/material`: provides system design components for building the UI and improve the user experience.
- `@faker-js/faker`: used to seed the database with realistic fake data for testing purposes.
- `@postgres`: establishes the connection between the backend and the PostgreSQL database.

## Database schema

1. Staff

```
CREATE TABLE staff (
    "id" UUID PRIMARY KEY,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "avatar" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. Users

```
CREATE TABLE users (
    "id" UUID PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "accountBalance" INT NOT NULL DEFAULT 0.00,
    "lastLogin" TIMESTAMP,
    "lastTransaction" TIMESTAMP,
    "lastBet" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

3. Transactions

```
CREATE TABLE transactions (
    "id" UUID PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES users(id),
    "employeeId" UUID REFERENCES staff(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "amount" INT NOT NULL,
    "transactionType" SMALLINT NOT NULL,
    "comment" TEXT
);
```

4. SlotGames

```
CREATE TABLE "slotGames" (
    "id" UUID PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);
```

5. Bets

```
CREATE TABLE bets (
    "id" UUID PRIMARY KEY,
    "userId" UUID REFERENCES users(id) NOT NULL,
    "slotGameId" UUID REFERENCES "slotGames"(id) NOT NULL,
    "wagerAmount" INT NOT NULL,
    "multiplier" DECIMAL(5, 2) NOT NULL,
    "status" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL
);
```

### Schema decisions

- Money is stored as INT in cents to reduce number of calculations with floating numbers
- Added indexes for the transactions and bets tables to help us quickly search them by userId and date:
  1. CREATE INDEX transactions_idx_userId_createdAt ON transactions("userId", "createdAt");
  2. CREATE INDEX bets_idx_userId_createdAt ON bets("userId", "createdAt")
- I added a `lastBet` and `lastTransaction` column to the users table, even though we could infer them from the transactions and bets tables to improve query performance and simplify data retrieval by avoiding other joins.

### Seed database

The `@faker-js/faker` library helps to seed the tables `user`, `staff`, `slotGames` with realistic fake data.

Seeding the `bets` and `transaction` tables is not as straightforward, since simply generating random values for bets and transcations could lead to invalid data. For example, a user could withdraw/bet more money than they have.

It's also important for the system to maintain a consistent database that follows the business rules to help with the tests.

For that, I simulated user events in the app when generating data for these tables. Here it follows the algorithm idea:

- Each account starts with a random bonus ranging from 1,000 to 10,000.
- A random number of bets placed by the user is selected (between 25 and 200). Let this be N.
- Generate N timestamp and sort them chronologically.
- For each timestamp, pick a `slotGame` randomly, a `wagerAmount` based on the `currentBalance`, a `multiplier` and decide whether the user won the bet.
- If they win, we update `currentBalance += wagerAmount * multiplier`, otherwise `currentBalance -= wagerAmount`
- After each event, there is a small chance to trigger a withdrawal (3%) or deposit (5%) transaction.

## API endpoints

`GET /api/users`

Returns a paginated list of users and `totalWagerAmount` by user

Query params:

- `limit`: `string`;
- `page`: `string`;
- `sortBy`: `string`;
- `sortOrder`: `asc` | `desc`;

---

`GET /api/users/:userId`

Returns the user object extended with the `totalDepositAmount` and `totalWithdrawAmount`

Path params:

- `userId`: `string`

---

`GET /api/users/:userId/transactions`

Returns a paginated list of transactions for the specified user.

Path params:

- `userId`: `string`

Query params:

- `limit`: `number`
- `page`: `number`

---

`GET /api/users/:userId/recent-bets`

Returns a list of the recent bets placed by the specified user.

Path params:

- `userId`: `string`

Query params:

- `daysLimit`: `number`
  Specifies the time frame for retrieving bets. The value represents the number of days from the current date. Example: If `daysLimit=7`, the API will return all bets placed in the last 7 days.

---

`GET /api/admin/logged-in`

Returns details of the currently logged-in staff member.

**Note:**
This is a mock implementation that returns the first row from the staff table. It simulates a logged-in admin who can add credit or debit to a user's account.

---

`POST /api/admin/adjust-user-balance`

Adjusts the balance of a specified user by adding a credit or a debit

Request body:

- `userId`: `string`
- `type`: `credit` | `debit`
- `amount`: `number` (should be negative for `debit` and `positive` for credit)
- `comment`: `string` (Optional)

## Running the app

1. Start the apps and the database serice with docker-compose

```
docker-compose up
```

2. Seed the database

```
cd backend
yarn db:seed
```

3. Access the frontend

```
localhost:5173
```

## Some Further improvements

- Share API types between backend and frotend via some generator (ex. OpenAPI)
- Validate inputs in all endpoints. For this challenge, I only added some validation for the `POST` endpoint, but we should ideally validate all endpoints
- Add error middleware in the backend to process errors in the requests and ensure that no internal data is exposed to API consumers.
- Unit tests in the backend
- E2E tests