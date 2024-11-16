import { query } from "../../db/query";

export async function getBattalion(id?: number) {
  const SQL = `
      SELECT 
          battalion_id,
          MIN(battalion_name) battalion_name,
          JSON_ARRAYAGG(JSON_OBJECT(
              'platoon_id', platoon_id,
              'platoon_name', platoon_name
          )) platoons
      FROM battalion
      LEFT JOIN platoon USING(battalion_id)
      ${id ? `WHERE battalion_id = ${+id} ` : ""}
      GROUP BY battalion_id
      `;
  const data = await query<{
    battalion_id: number;
    battalion_name: string;
    platoons: {
      platoon_id: number;
      platoon_name: string;
    }[];
  }>(SQL);
  return data;
}

export async function getPlatoon(
  userID: number,
  battalion_id: number,
  id?: number
) {
  const SQL = `
    SELECT platoon_id, platoon_name, battalion_id FROM platoon
    WHERE battalion_id = ${+battalion_id}
    platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${userID})
    ${id ? `AND platoon_id = ${+id}` : ""}
  `;
  const data = query<{
    platoon_id: number;
    platoon_name: string;
    battalion_id: number;
  }>(SQL);
  return data;
}
