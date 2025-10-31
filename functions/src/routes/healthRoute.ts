import { Router } from "express";
import type { Request, Response } from "express";

const healthRouter = Router();

// Sample route to test server health
healthRouter.get("/health", (req: Request, res: Response) => {
  return res.json({ ok: true, time: new Date().toISOString });
});

export default healthRouter;