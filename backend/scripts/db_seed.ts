import { faker } from "@faker-js/faker";
import momemt from "moment";
import ora from "ora";
import sql from "../src/postgres";
import { User } from "../src/models/user";
import { BetStatus, SlotGame } from "../src/models/bet";

faker.seed(0);

async function insertData(tableName: string, data: Record<string, unknown>) {
  await sql`INSERT INTO ${sql(tableName)} ${sql(data, ...Object.keys(data))}`;
}

async function createUser() {
  const user = {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    accountBalance: 0,
    createdAt: faker.date.between({
      from: momemt().subtract(6, "months").toDate(),
      to: momemt().subtract(3, "months").toDate(),
    }),
  };

  await insertData("users", user);

  return user;
}

async function createEmployee() {
  const employee = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatarGitHub(),
    createdAt: faker.date.past(),
  };

  await insertData("staff", employee);

  return employee;
}

async function createSlotGame() {
  const slotGame = {
    id: faker.string.uuid(),
    name: `${faker.animal.bird()} ${faker.lorem.word()}`,
  };

  await insertData("slotGames", slotGame);

  return slotGame;
}

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIntInRange(minimum: number, maximum: number) {
  return minimum + Math.floor(Math.random() * (maximum - minimum + 1));
}

function randomDecimalInRange(minimum: number, maximum: number) {
  return minimum + Math.random() * (maximum - minimum);
}

async function createNewDeposit(
  user: User,
  transactionTime: Date,
  { bonus } = { bonus: false }
) {
  const MINIMUM = 1000_00;
  const MAXIMUM = 10000_00;

  const depositAmount = randomIntInRange(MINIMUM, MAXIMUM);

  const deposit = {
    id: faker.string.uuid(),
    userId: user.id,
    createdAt: transactionTime,
    amount: depositAmount,
    transactionType: !bonus ? 1 : 3,
    comment: bonus ? faker.lorem.sentence() : null,
  };

  await insertData("transactions", deposit);

  return deposit;
}

async function createNewWithdraw(user: User, transactionTime: Date, accountBalance: number) {
  const withdrawAmount = Math.floor(
    accountBalance * randomDecimalInRange(0.5, 1)
  );
  const withdraw = {
    id: faker.string.uuid(),
    userId: user.id,
    createdAt: transactionTime,
    amount: -withdrawAmount,
    transactionType: 2,
  };

  await insertData("transactions", withdraw);

  return withdraw;
}

async function createNewBet(
  user: User,
  slotGame: SlotGame,
  wagerAmount: number,
  multiplier: number,
  status: BetStatus,
  betTime: Date,
) {
  const bet = {
    id: faker.string.uuid(),
    userId: user.id,
    slotGameId: slotGame.id,
    wagerAmount,
    multiplier,
    status,
    createdAt: betTime,
  };

  await insertData("bets", bet);

  return bet;
}

async function updateUserData(user: User, updateData: Record<string, unknown>) {
  await sql`UPDATE users set ${sql(
    updateData,
    ...Object.keys(updateData)
  )} where id = ${user.id}`;
}

async function processEventsForUsers(user: User, slotGames: SlotGame[]) {
  const firstBonus = await createNewDeposit(user, user.createdAt, {
    bonus: true,
  });
  let accountBalance = firstBonus.amount;

  const numberOfBets = randomIntInRange(25, 200);

  let userLastTransaction = undefined,
    userLastBet = undefined;

  const betDates = Array.from({ length: numberOfBets })
    .map(() =>
      faker.date.between({
        from: momemt().subtract(30, "days").toDate(),
        to: momemt().toDate(),
      })
    )
    .sort((a, b) => momemt(a).diff(momemt(b)));

  for (const betDate of betDates) {
    const didWin = randomIntInRange(1, 100) <= 40;
    const multiplier = randomDecimalInRange(1.1, 3);
    const wagerAmount = Math.floor(
      randomDecimalInRange(0.1, 0.3) * accountBalance
    );
    const slotGame = pickRandom(slotGames);

    userLastBet = await createNewBet(
      user,
      slotGame,
      wagerAmount,
      multiplier,
      didWin ? 1 : 2,
      betDate
    );

    accountBalance -= wagerAmount;
    if (didWin) {
      accountBalance += Math.round(wagerAmount * multiplier);
    }

    const shouldCreateNewWithdraw = randomIntInRange(1, 100) <= 3;
    if (shouldCreateNewWithdraw) {
      const withdraw = await createNewWithdraw(user, betDate, accountBalance);
      accountBalance += withdraw.amount;
      userLastTransaction = withdraw;
    }
    const shouldCreateNewDeposit = randomIntInRange(1, 100) <= 5;
    if (shouldCreateNewDeposit) {
      const deposit = await createNewDeposit(user, betDate);
      accountBalance += deposit.amount;
      userLastTransaction = deposit;
    }
  }
  await updateUserData(user, {
    accountBalance,
    lastLogin:
      userLastTransaction?.createdAt ??
      userLastBet?.createdAt ??
      user.createdAt,
    lastBet: userLastBet?.createdAt ?? null,
    lastTransaction: userLastTransaction?.createdAt ?? null,
  });
}

async function seed() {
  await sql`DELETE FROM bets`;
  await sql`DELETE FROM transactions`;
  await sql`DELETE FROM "slotGames"`;
  await sql`DELETE FROM users`;
  await sql`DELETE FROM staff`;

  const userPromises = [];
  for (let i = 0; i < 1000; i++) {
    userPromises.push(createUser());
  }
  const users = await Promise.all(userPromises);
  console.log("Created users");

  const staffPromises = [];
  for (let i = 0; i < 10; i++) {
    staffPromises.push(createEmployee());
  }
  const staff = await Promise.all(staffPromises);
  console.log("Created staff");

  const slotGamePromises = [];
  for (let i = 0; i < 10; i++) {
    slotGamePromises.push(createSlotGame());
  }
  const slotGames = await Promise.all(slotGamePromises);
  console.log("Created slotGames");

  const spinner = ora("Creating bets and transactions").start();
  await Promise.all(
    users.map((user) => processEventsForUsers(user, slotGames))
  );
  spinner.clear();
}

seed()
  .then(() => {
    console.log("Finished");
    process.exit(0);
  })
  .catch((e) => {
    console.log("Error", e);
    process.exit(1);
  });
