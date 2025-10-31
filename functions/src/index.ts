import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import express from "express";
import healthRouter from "./routes/healthRoute";

// initialzie the express app
const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Route handlers
app.get("/health", healthRouter);

// Export the Express app as a single HTTPS function.
export const api = onRequest(
  {
    cors: true,
    region: "us-central1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 10,
  },
  app
);
