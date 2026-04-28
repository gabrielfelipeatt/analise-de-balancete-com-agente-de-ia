import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { routes } from "./api/routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { ensureBrain } from "./services/brainService.js";

await ensureBrain();

const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", routes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
