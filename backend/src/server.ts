import admin from "firebase-admin";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
// import taskRouter from "./src/routes/TaskRoute.ts";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Default route
app.get("/", (_, res) => res.send("✅ JournalXP Backend Running"));

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

export default app;
