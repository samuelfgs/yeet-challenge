import postgres from "postgres";
import config from "./config";

const sql = postgres(
  `postgresql://postgres:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbDatabase}`
);

export default sql;
