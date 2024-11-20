import { Router } from "express";
import { requireAuth, roleEnum } from "../../middleware/auth";
import { insert, query, update } from "../../db/query";
import { TRole } from "../../utils/jwt";
import { respond, respond401, respond500 } from "../../utils/responses";
import { validateSchema } from "../../middleware/schema";
import { postUserSchema, putUserSchema, validateUsername } from "./schema";
import bcrypt from "bcrypt";
import { getUserById } from "./service";
import { dateToMysql } from "../../utils/dates";

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
        [username, hashedPassword, role, role == "admin" ? 0 : level_id]
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
usersRouter.put(
  "/:id",
  requireAuth(),
  validateSchema(putUserSchema),
  async (req, res) => {
    const id = +req.params.id;
    if (!id) {
      respond401(res, "id must be a number");
      return;
    }
    try {
      const {
        username,
        password,
        role,
        level_id,
        deleted,
      }: {
        username: string;
        password: string;
        role: TRole;
        level_id: number;
        deleted: boolean;
      } = req.body;

      const user = await getUserById(id);
      if (!user) {
        respond(res, 400, "User doesn't exist");
        return;
      }

      if (
        (role != undefined && roleEnum[role] < roleEnum[req.user.role]) ||
        roleEnum[user.role] < roleEnum[req.user.role]
      ) {
        respond401(
          res,
          "User doesn't have access to edit users with this role"
        );
        return;
      }
      if (
        (level_id != undefined &&
          ((role == "battalion" &&
            !req.user.platoons.find((x) => x.battalion_id == level_id)) ||
            (role == "platoon" &&
              !req.user.platoons.find((x) => x.platoon_id == level_id)))) ||
        (user.role == "battalion" &&
          !req.user.platoons.find((x) => x.battalion_id == user.level_id)) ||
        (user.role == "platoon" &&
          !req.user.platoons.find((x) => x.platoon_id == user.level_id))
      ) {
        respond401(res, "User cannot edit user with that access level");
        return;
      }

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      await update(
        "users",
        {
          username,
          password: hashedPassword,
          role,
          level_id,
          deleted_date: deleted
            ? dateToMysql(new Date())
            : deleted == false
            ? null
            : undefined,
        },
        `id = ${id}`
      );

      const data = await getUserById(id);
      console.log("data", data);

      if (data) {
        res.json({
          data,
          success: true,
        });
        return;
      }

      respond500(res, "Failed to update user, please try again later");
    } catch (error) {
      console.log(error);

      respond500(res);
    }
  }
);

usersRouter.post(
  "/validate-username",
  requireAuth(),
  validateSchema(validateUsername),
  async (req, res) => {
    const { username } = req.body;
    try {
      const data = await query("SELECT TRUE FROM users WHERE username = ?", [
        username,
      ]);
      res.json({
        success: true,
        valid: !data.length,
      });
    } catch (error) {
      respond500(res);
      return;
    }
  }
);
