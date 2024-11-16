import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../db/pool";
import { respond401 } from "../../utils/responses";
import { getTokenForUser } from "./token";
import { requireAuth } from "../../middleware/auth";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) respond401(res, "username is required");
    else if (!password) respond401(res, "password is required");
    else {
      const [users]: [{ username: string; password: string; id: number }[]] =
        (await pool.query(
          `SELECT * FROM users WHERE username = ? AND deleted_date IS NULL`,
          [username]
        )) as any;
      if (!users.length) {
        respond401(res, "username doesn't exist");
      } else {
        const hashedPassword = users[0].password;
        const results = await bcrypt.compare(password, hashedPassword);
        if (!results) respond401(res, "Password is incorrect");
        else {
          const token = await getTokenForUser(users[0].id);
          res.json({
            token,
            success: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "An error occurred, try again later",
    });
  }
});

authRouter.get("/test", requireAuth(), (req, res) => {
  res.json({
    success: true,
  });
});
