import "dotenv/config";

import express from "express";
import { authRouter } from "./routes/auth";
import { orgRouter } from "./routes/org";
import { usersRouter } from "./routes/users";
import { hrRouter } from "./routes/hr";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    preflightContinue: true,
  })
);

app.use("/auth", authRouter);
app.use("/org", orgRouter);
app.use("/users", usersRouter);
app.use("/hr", hrRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`)
);
