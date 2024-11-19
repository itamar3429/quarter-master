import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { respond, respond401, respond500 } from "../../utils/responses";
import { insert, query } from "../../db/query";
import { getBattalion, getPlatoon } from "./service";
import {
  addBattalionSchema,
  validateBattalionName,
  validatePlatoonName,
} from "./schema";
import { validateSchema } from "../../middleware/schema";
import { getTokenForUser } from "../auth/token";

export const orgRouter = Router();

orgRouter.get("/battalion", requireAuth("battalion"), async (req, res) => {
  try {
    const data = await getBattalion();
    res.json({
      data,
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

orgRouter.get("/battalion/:id", requireAuth("admin"), async (req, res) => {
  try {
    if (!req.params.id) {
      respond401(res, "id must be a number");
      return;
    }
    const data = await getBattalion(+req.params.id);
    if (!data || !data.length) {
      respond401(res, "Failed to find the requested battalion");
      return;
    }
    res.json({
      data: data[0],
      success: true,
    });
  } catch (error) {
    respond500(res);
  }
});

orgRouter.post(
  "/battalion",
  requireAuth("admin"),
  validateSchema(addBattalionSchema),
  async (req, res) => {
    try {
      const payload = req.body;
      const response = await insert(
        "INSERT INTO battalion (battalion_name) VALUES (?)",
        [payload.battalion_name]
      );
      const data = await getBattalion(response.insertId);
      if (!data || !data.length) {
        respond401(res, "Failed to find the requested battalion");
        return;
      }
      res.json({
        data: data[0],
        token: await getTokenForUser(req.user.id),
        success: true,
      });
    } catch (error) {
      respond500(res);
    }
  }
);

orgRouter.get(
  "/battalion/:id/platoon",
  requireAuth("battalion"),
  async (req, res) => {
    try {
      if (!+req.params.id) {
        respond(res, 400, "id must be a number");
        return;
      }
      const data = await getPlatoon(req.user.id, +req.params.id);
      if (data) {
        res.json({
          data,
          success: true,
        });
        return;
      }
      respond500(res);
    } catch (error) {
      respond500(res);
    }
  }
);
orgRouter.get(
  "/battalion/:id/platoon/:platoonID",
  requireAuth("battalion"),
  async (req, res) => {
    try {
      if (!+req.params.id) {
        respond(res, 400, "id must be a number");
        return;
      }
      if (!+req.params.platoonID) {
        respond(res, 400, "platoonID must be a number");
        return;
      }
      const data = await getPlatoon(
        req.user.id,
        +req.params.id,
        +req.params.platoonID
      );
      if (data && data.length) {
        res.json({
          data: data[0],
          success: true,
        });
        return;
      }
      respond500(res);
    } catch (error) {
      respond500(res);
    }
  }
);
orgRouter.post(
  "/battalion/:id/platoon",
  requireAuth("battalion"),
  async (req, res) => {
    try {
      if (!+req.params.id) {
        respond401(res, "id must be a number");
        return;
      }
      if (!req.user.platoons.find((x) => x.battalion_id == +req.params.id)) {
        respond(res, 400, "Couldn't find the battalion");
        return;
      }
      const payload = req.body;
      if (
        !payload?.platoon_name ||
        typeof payload.platoon_name != "string" ||
        payload.platoon_name.length < 3 ||
        payload.platoon_name.length > 50
      ) {
        respond(
          res,
          400,
          "platoon_name is required, and must have 3-50 characters"
        );
        return;
      }
      const response = await insert(
        "INSERT INTO platoon (platoon_name, battalion_id) VALUES (?, ?)",
        [payload.platoon_name, +req.params.id]
      );
      if (!response.insertId) {
        respond500(res);
        return;
      }
      const data = await getPlatoon(
        req.user.id,
        +req.params.id,
        response.insertId
      );
      if (data && data.length) {
        res.json({
          data: data[0],
          token: await getTokenForUser(req.user.id),
          success: true,
        });
        return;
      }
      respond401(res, "Failed to find the requested platoon");
    } catch (error) {
      console.log(error);

      respond500(res);
    }
  }
);

orgRouter.post(
  "/battalion/validate",
  requireAuth("admin"),
  validateSchema(validateBattalionName),
  async (req, res) => {
    try {
      const { name } = req.body;
      const data = await query(
        "SELECT TRUE a FROM battalion WHERE battalion_name = ?",
        [name.trim()]
      );
      res.json({
        success: true,
        valid: data.length == 0,
      });
    } catch (error) {
      respond500(res);
    }
  }
);

orgRouter.post(
  "/platoon/validate",
  requireAuth("battalion"),
  validateSchema(validatePlatoonName),
  async (req, res) => {
    try {
      const { battalion_id, platoon_name } = req.body;
      const data = await query(
        "SELECT TRUE a FROM platoon WHERE battalion_id = ? AND platoon_name = ?",
        [battalion_id, platoon_name.trim()]
      );
      res.json({
        success: true,
        valid: data.length == 0,
      });
    } catch (error) {
      respond500(res);
    }
  }
);
