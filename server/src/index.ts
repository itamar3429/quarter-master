import "dotenv/config";

import express from "express";
import { authRouter } from "./routes/auth";
import { orgRouter } from "./routes/org";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/management", orgRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`)
);
