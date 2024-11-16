import fs from "fs";

export const config = {
  mysqlHost: process.env.DB_HOST,
  mysqlPort: +process.env.DB_PORT!,
  mysqlUser: process.env.DB_USER,
  mysqlPassword: process.env.DB_PASSWORD,
  mysqlDB: process.env.DB_DB,
  dev: process.env.NODE_ENV != "production",
  prvKey: fs.readFileSync(__dirname + "/ssh/private.key", "utf8"),
  pblKey: fs.readFileSync(__dirname + "/ssh/public.key", "utf8"),
};
