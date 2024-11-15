import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../db/pool";
import { respond401 } from "../../utils/responses";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username) respond401(res, "username is required");
  else if (!password) respond401(res, "password is required");
  else {
    const [users]: [{ username: string; password: string }[]] =
      (await pool.query(`SELECT * FROM users WHERE username = :username`, {
        username,
      })) as any;
    console.log(users);
    if (!users.length) {
      respond401(res, "username doesn't exist");
    } else {
      const hashedPassword = users[0].password;
      const results = await bcrypt.compare(password, hashedPassword);
      if (!results) respond401(res, "Password is incorrect");
      else {
        // return jwt token
      }
    }
  }
});
authRouter.post("/user", (req, res) => {});
authRouter.put("/:userID", (req, res) => {});
