import { ResultSetHeader } from "mysql2";
import { pool } from "./pool";

export async function query<T extends Record<string, any>>(
  sql: string,
  values?: any[]
) {
  const [res] = await pool.query(sql, values);
  return res as T[];
}
export async function insert(sql: string, values?: any[]) {
  const res = await pool.query(sql, values);
  return res[0] as ResultSetHeader;
}
