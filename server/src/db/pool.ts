import mysql from "mysql2";
import { config } from "../config";

export const pool = mysql
  .createPool({
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    port: config.mysqlPort,
    connectionLimit: 20,
    database: config.mysqlDB,
  })
  .promise();
