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

CREATE TABLE staff (
    "id" UUID PRIMARY KEY,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "avatar" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    "id" UUID PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES users(id),
    "employeeId" UUID REFERENCES staff(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "amount" INT NOT NULL,
    "transactionType" SMALLINT NOT NULL,
    "comment" TEXT
);
CREATE INDEX transactions_idx_userId_createdAt ON transactions("userId", "createdAt");

CREATE TABLE "slotGames" (
    "id" UUID PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL
);

CREATE TABLE bets (
    "id" UUID PRIMARY KEY,
    "userId" UUID REFERENCES users(id) NOT NULL,
    "slotGameId" UUID REFERENCES "slotGames"(id) NOT NULL,
    "wagerAmount" INT NOT NULL,
    "multiplier" DECIMAL(5, 2) NOT NULL,
    "status" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL
);
CREATE INDEX bets_idx_userId_createdAt ON transactions("userId", "createdAt");