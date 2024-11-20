import { query } from "../../db/query";
import { TRole } from "../../utils/jwt";

export async function getUserById(id: number) {
  const SQL = `
  SELECT id, username, role, level_id, created_date, deleted_date FROM users
  WHERE id = ${id}
`;

  const data = await query<{
    id: number;
    username: string;
    role: TRole;
    level_id: number;
    created_date: string;
    deleted_date: string;
  }>(SQL);
  if (!data.length) return;
  return data[0];
}
