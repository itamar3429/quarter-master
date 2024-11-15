import "dotenv/config";

import express from "express";
import { authRouter } from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`)
);
