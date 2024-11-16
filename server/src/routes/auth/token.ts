import { jwtSign } from "../../utils/jwt";
import { pool } from "../../db/pool";

export async function getTokenForUser(userID: number) {
  const [res]: [
    {
      id: number;
      username: string;
      role: string;
      level_id: number;
      platoons: any;
    }[]
  ] = (await pool.query(`
        SELECT id,
            min(username) username,
            min(role)role,
            min(level_id) level_id,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'platoon_id', platoon_id,
                    'platoon_name', platoon_name,
                    'battalion_id', battalion_id,
                    'battalion_name', battalion_name
                )
            ) platoons
        FROM users_view
        GROUP BY id
    `)) as any;

  return jwtSign(res[0]);
}
