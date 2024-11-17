import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { insertEasy, query, update } from "../../db/query";
import { respond, respond401, respond500 } from "../../utils/responses";
import { validateSchema } from "../../middleware/schema";
import {
  newControlledEquipmentRegistration,
  newEquipment,
  newEquipmentRegistration,
} from "./schema";
import { pool } from "../../db/pool";
import { dateToMysql } from "../../utils/dates";

const equipmentRouter = Router();

equipmentRouter.use(requireAuth());

// Get all equipment in warehouse
equipmentRouter.get("/list", async (req, res) => {
  try {
    const data = await query(
      `SELECT * from equipment WHERE platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})`
    );
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

equipmentRouter.post(
  "/item",
  validateSchema(newEquipment),
  async (req, res) => {
    try {
      const {
        name,
        platoon_id,
        type,
      }: { platoon_id: number; name: string; type: string } = req.body;
      if (!req.user.platoons.find((x) => x.platoon_id == platoon_id)) {
        respond401(res, "User doesn't have access to that platoon");
        return;
      }

      const response = await insertEasy("equipment", {
        platoon_id,
        name,
        type,
      });
      if (response.insertId) {
        const data = await query(
          `SELECT * from equipment WHERE id = ${response.insertId}`
        );
        if (data.length)
          res.json({
            data: data[0],
            success: true,
          });
        else {
          throw "Failed to get the requested equipment";
        }
      } else throw "Failed to add an equipment item";
    } catch (error) {
      respond500(res);
    }
  }
);

equipmentRouter.get("/warehouse", async (req, res) => {
  try {
    const data = await query(
      `SELECT * FROM equipment_registry 
      WHERE deleted_date IS NULL 
      AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})`
    );
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

equipmentRouter.get("/warehouse/controlled", async (req, res) => {
  try {
    const data = await query(
      `SELECT * FROM controlled_equipment_registry 
      WHERE deleted_date IS NULL
      AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})`
    );
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

equipmentRouter.post(
  "/warehouse",
  validateSchema(newEquipmentRegistration),
  async (req, res) => {
    try {
      const {
        current_count,
        equipment_id,
        platoon_id,
        required_count,
      }: {
        platoon_id: number;
        equipment_id: number;
        current_count: number;
        required_count: number;
      } = req.body;

      const validate = await query(
        `SELECT TRUE FROM equipment
          WHERE id = ${equipment_id} and platoon_id = ${platoon_id} AND type = 'regular'
          AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})`
      );
      if (!validate.length) {
        respond(res, 401, "Couldn't find the requested equipment for the user");
        return;
      }
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        await update(
          "equipment_registry",
          {
            deleted_date: dateToMysql(new Date()),
          },
          `equipment_id = ${equipment_id} AND platoon_id = ${platoon_id}`,
          conn
        );
        const response = await insertEasy("equipment_registry", {
          platoon_id,
          equipment_id,
          current_count,
          required_count,
        });

        if (response.insertId) {
          const data = await query(
            `SELECT * FROM equipment_registry 
            WHERE id = ${response.insertId}`
          );
          res.json({
            data: data[0],
            success: true,
          });
        }

        await conn.commit();
      } catch (error) {
        conn.rollback();
        respond500(res);
      }
    } catch (error) {
      respond500(res);
    }
  }
);

equipmentRouter.post(
  "/warehouse/controlled",
  validateSchema(newControlledEquipmentRegistration),
  async (req, res) => {
    try {
      const {
        equipment_id,
        platoon_id,
        item_code,
        soldier_id,
      }: {
        platoon_id: number;
        equipment_id: number;
        soldier_id: number;
        item_code: string;
      } = req.body;

      const validate = await query(
        `SELECT TRUE FROM equipment
        WHERE id = ${equipment_id} and platoon_id = ${platoon_id} AND type = 'controlled'
        AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})
        UNION ALL
        SELECT TRUE FROM soldiers
        WHERE id = ${soldier_id} 
        AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${req.user.id})
        AND platoon_id = ${platoon_id}`
      );
      if (validate.length < 2) {
        respond(res, 401, "Failed to find the equipment or soldier");
        return;
      }
      const conn = await pool.getConnection();
      await conn.beginTransaction();
      try {
        const response = await insertEasy("controlled_equipment_registry", {
          platoon_id,
          equipment_id,
          soldier_id,
          item_code,
        });

        if (response.insertId) {
          const data = await query(
            `SELECT * FROM controlled_equipment_registry 
            WHERE id = ${response.insertId}`
          );
          res.json({
            data: data[0],
            success: true,
          });
        }

        await conn.commit();
      } catch (error) {
        conn.rollback();
        respond500(res);
      }
    } catch (error) {
      respond500(res);
    }
  }
);

equipmentRouter.delete("/warehouse/controlled/:id", async (req, res) => {
  try {
    if (!+req.params.id) {
      respond401(res, "id must be a number");
      return;
    }
    const data = await update(
      "controlled_equipment_registry",
      {
        deleted_date: dateToMysql(new Date()),
      },
      `id = ${+req.params.id}
      AND platoon_id IN (SELECT platoon_id FROM users_view WHERE id = ${
        req.user.id
      })`
    );
    if (data.affectedRows) {
      res.json({ success: true });
    } else throw "Failed to find registry to delete";
  } catch (error) {
    respond500(res);
  }
});
