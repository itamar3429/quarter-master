import { ResultSetHeader } from "mysql2";
import { pool } from "./pool";
import type { PoolConnection } from "mysql2/promise";

export async function query<T extends Record<string, any>>(
  sql: string,
  values?: any[],
  connection?: PoolConnection
) {
  const [res] = await (connection || pool).query(sql, values);
  return res as T[];
}
export async function insert(
  sql: string,
  values?: any[],
  connection?: PoolConnection
) {
  const res = await (connection || pool).query(sql, values);
  return res[0] as ResultSetHeader;
}

export async function update(
  tableName: string,
  values: Record<string, null | string | number | boolean | undefined>,
  whereClause: string,
  connection?: PoolConnection
) {
  let sql = `UPDATE ${tableName}
  SET `;
  const params: (null | string | number | boolean)[] = [];
  const entries = Object.entries(values).filter((x) => x[1] !== undefined);
  console.log(values, entries);

  if (!entries.length) throw new Error("Cannot have an empty update");
  entries.forEach(([key, value], i) => {
    params.push(value!);
    sql += `${i ? `, ` : ""} ${key} = ?`;
  });
  sql += " WHERE " + whereClause;
  const res = await (connection || pool).query(sql, params);
  return res[0] as ResultSetHeader;
}

export async function insertEasy(
  tableName: string,
  values: Record<string, null | string | number | boolean | undefined>,
  connection?: PoolConnection
) {
  let fields = "";
  let vals = "";
  const params: (null | string | number | boolean)[] = [];
  const entries = Object.entries(values).filter((x) => x[1] !== undefined);
  if (!entries.length) throw new Error("Cannot have an empty insert");
  entries.forEach(([key, value], i) => {
    params.push(value!);
    fields += `${i ? `, ` : ""} ${key}`;
    vals += `${i ? `, ` : ""} ?`;
  });
  const sql = `INSERT INTO ${tableName} (${fields}) VALUES (${vals})`;
  const res = await (connection || pool).query(sql, params);
  return res[0] as ResultSetHeader;
}
