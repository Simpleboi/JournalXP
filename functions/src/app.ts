import express from "express";
import cors from "cors";
import { Router } from "express";

// Initialize express app
const app = express();

// Configure middleware
app.use(cors()); 
app.use(express.json()); 

// Create a router for our API endpoints
const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Mount the router at the root path
app.use("/", router);

export default app;
