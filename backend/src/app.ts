import express from "express";
import cors from "cors";
import tasksRouter from "./routes/TaskRoute";
import { Example } from "@shared/utils/example";

const app = express();
Example();
// Global middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Health & root
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("✅ JournalXP Backend Running"));

// API routes
app.use("/api/tasks", tasksRouter);

export default app;
