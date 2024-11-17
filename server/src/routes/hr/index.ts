import { insert, insertEasy, query, update } from "../../db/query";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { respond401, respond500 } from "../../utils/responses";
import { validateSchema } from "../../middleware/schema";
import { newSoldier, newSoldierActivity, updateSoldier } from "./schema";
import { dateToMysql } from "../../utils/dates";
import { pool } from "../../db/pool";

export const hrRouter = Router();

hrRouter.get("/soldier", requireAuth(), async (req, res) => {
  try {
    const data = await query(`
      SELECT a.*, 
        IF(b.id IS NULL, NULL, JSON_OBJECT(
          'location', b.location,
          'note', b.note,
          'date', b.start_date
        )) activity
      FROM soldiers a
      LEFT JOIN soldier_activity b ON a.id = b.soldier_id AND b.end_date IS NULL
      WHERE a.platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})
    `);

    res.json({ data, success: true });
  } catch (error) {
    respond500(res);
  }
});
hrRouter.get("/soldier/:id", requireAuth(), async (req, res) => {
  try {
    if (!+req.params.id) {
      respond401(res, "id must be a number");
      return;
    }
    const data = await query(`
      SELECT a.*, 
        IF(b.id IS NULL, NULL, JSON_OBJECT(
          'location', b.location,
          'note', b.note,
          'date', b.start_date
        )) activity
      FROM soldiers a
      LEFT JOIN soldier_activity b ON a.id = b.soldier_id AND b.end_date IS NULL
      WHERE a.platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${
        req.user.id
      })
      AND a.id = ${+req.params.id}
    `);
    if (data.length) res.json({ data: data[0], success: true });
    else {
      respond401(res, "Failed to find the request soldier");
    }
  } catch (error) {
    respond500(res);
  }
});

hrRouter.post(
  "/soldier",
  requireAuth(),
  validateSchema(newSoldier),
  async (req, res) => {
    try {
      const {
        department,
        f_name,
        l_name,
        personal_id,
        platoon_id,
        role,
      }: {
        f_name: string;
        l_name: string;
        personal_id: string;
        department: string;
        role: string;
        platoon_id: number;
      } = req.body;
      if (!req.user.platoons.find((x) => x.platoon_id == platoon_id)) {
        respond401(
          res,
          "User doesn't have access to manage soldiers for that platoon"
        );
        return;
      }
      const response = await insert(
        "INSERT INTO soldiers (f_name, l_name, personal_id, department, role, platoon_id) VALUES (?,?,?,?,?,?)",
        [f_name, l_name, personal_id, department, role, platoon_id]
      );
      if (response?.insertId) {
        const data = await query(`
          SELECT * FROM soldiers
          WHERE id = ${response.insertId}
        `);
        if (data.length) res.json({ data: data[0], success: true });
        else {
          respond401(res, "Failed to find the request soldier");
        }
      } else {
        respond500(res, "Failed to add a soldier");
      }
    } catch (error) {
      respond500(res);
    }
  }
);
hrRouter.put(
  "/soldier/:id",
  requireAuth(),
  validateSchema(updateSoldier),
  async (req, res) => {
    try {
      if (!+req.params.id) {
        respond401(res, "id must be a number");
        return;
      }
      const {
        department,
        f_name,
        l_name,
        personal_id,
        platoon_id,
        role,
        deleted,
      }: {
        f_name?: string;
        l_name?: string;
        personal_id?: string;
        department?: string;
        role?: string;
        platoon_id?: number;
        deleted?: boolean;
      } = req.body;
      if (
        platoon_id != undefined &&
        !req.user.platoons.find((x) => x.platoon_id == platoon_id)
      ) {
        respond401(
          res,
          "User doesn't have access to manage soldiers for that platoon"
        );
        return;
      }
      const response = await update(
        "soldiers",
        {
          f_name,
          l_name,
          department,
          personal_id,
          platoon_id,
          role,
          deleted_date:
            deleted == undefined
              ? undefined
              : deleted
              ? dateToMysql(new Date())
              : null,
        },
        `id = ${+req.params
          .id} AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${
          req.user.id
        })`
      );
      if (response.affectedRows) {
        const data = await query(`
          SELECT * FROM soldiers
          WHERE id = ${+req.params.id}
        `);
        if (data.length) res.json({ data: data[0], success: true });
        else {
          respond401(res, "Failed to find the request soldier");
        }
      } else {
        respond500(res, "Failed to update the soldier");
      }
    } catch (error) {
      respond500(res);
    }
  }
);

hrRouter.post(
  "/solder/:id/activity",
  requireAuth(),
  validateSchema(newSoldierActivity),
  async (req, res) => {
    if (!+req.params.id) {
      respond401(res, "id must be a number");
      return;
    }
    const soldier = await query<{
      id: number;
      platoon_id: number;
    }>(`SELECT * FROM soldiers WHERE id = ${+req.params.id}`);
    if (!soldier.length) {
      respond401(res, "Failed to find the soldier");
      return;
    }
    if (!req.user.platoons.find((x) => x.platoon_id == soldier[0].platoon_id)) {
      respond401(res, "Failed to find the soldier");
      return;
    }

    const { location, note }: { location: string; note: string } = req.body;

    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      await update(
        "soldier_activity",
        {
          end_date: dateToMysql(new Date()),
        },
        `soldier_id = ${soldier[0].id} AND end_date IS NULL`,
        conn
      );
      const response = await insertEasy(
        "soldier_activity",
        {
          soldier_id: soldier[0].id,
          platoon_id: soldier[0].platoon_id,
          location,
          note,
        },
        conn
      );
      if (response.insertId) {
        const data = await query<{
          id: number;
          soldier_id: number;
          platoon_id: number;
          location: string;
          note: string;
          start_date: string;
        }>(
          `SELECT location, note, start_date FROM soldier_activity WHERE id = ${response.insertId}`,
          undefined,
          conn
        );
        if (data.length) {
          res.json({
            data: data[0],
            success: true,
          });
        } else {
          throw new Error("Failed to get the soldier activity");
        }
      }

      await conn.commit();
      pool.releaseConnection(conn);
    } catch (error) {
      conn.rollback();
      pool.releaseConnection(conn);
      respond500(res);
    }
  }
);
