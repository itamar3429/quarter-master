import { Router } from "express";
import { requireAuth, roleEnum } from "../../middleware/auth";
import { insert, query } from "../../db/query";
import { TRole } from "../../utils/jwt";
import { respond401, respond500 } from "../../utils/responses";
import { validateSchema } from "../../middleware/schema";
import { postUserSchema } from "./schema";
import bcrypt from "bcrypt";

export const usersRouter = Router();

usersRouter.get("/list", requireAuth(), async (req, res) => {
  try {
    let whereClause = "";
    if (req.user.role == "battalion") {
      whereClause = ` 
        AND (
          (role = 'battalion' AND level_id IN (SELECT battalion_id FROM users_view WHERE id = ${req.user.id}))
          OR (role = 'platoon' AND level_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id}))
        )
      `;
    }
    if (req.user.role == "platoon") {
      whereClause = `
        AND role = 'platoon'
        AND level_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})
      `;
    }
    const SQL = `
        SELECT id, username, role, level_id, created_date, deleted_date FROM users
        WHERE TRUE
        ${whereClause}
      `;

    const data = await query<{
      id: number;
      username: string;
      role: TRole;
      level_id: string;
      created_date: string;
      deleted_date: string;
    }>(SQL);
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

usersRouter.post(
  "/",
  requireAuth(),
  validateSchema(postUserSchema),
  async (req, res) => {
    try {
      const {
        username,
        password,
        role,
        level_id,
      }: { username: string; password: string; role: TRole; level_id: number } =
        req.body;

      if (roleEnum[role] < roleEnum[req.user.role]) {
        respond401(res, "User doesn't have access to add users with this role");
        return;
      }
      if (
        (role == "battalion" &&
          !req.user.platoons.find((x) => x.battalion_id == level_id)) ||
        (role == "platoon" &&
          !req.user.platoons.find((x) => x.platoon_id == level_id))
      ) {
        respond401(res, "User cannot add user with that access level");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await insert(
        "INSERT INTO users (username, password, role, level_id) VALUES (?,?,?,?)",
        [username, password, role, role == "admin" ? 0 : level_id]
      );
      if (response.insertId) {
        const SQL = `
          SELECT id, username, role, level_id, created_date, deleted_date FROM users
          WHERE id = ${response.insertId}
        `;

        const data = await query<{
          id: number;
          username: string;
          role: TRole;
          level_id: string;
          created_date: string;
          deleted_date: string;
        }>(SQL);
        res.json({
          data: data[0],
          success: true,
        });
      } else {
        respond500(res, "Failed to add user, please try again later");
      }
    } catch (error) {
      respond500(res);
    }
  }
);
