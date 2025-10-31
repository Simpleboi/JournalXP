import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import express from "express";
import healthRouter from "./routes/healthRoute";
import sessionRouter from "./routes/session";

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

// Sample
app.use((req, _res, next) => {
  console.log("REQ:", req.method, req.path);
  next();
});

app.post("/session/init-direct", (_req, res) => {
  res.json({ ok: true, route: "init-direct" });
});

// Route handlers
app.get("/health", healthRouter);
app.use("/session", sessionRouter);

// DEBUG: list registered routes
function listRoutes() {
  // @ts-ignore
  const stack = app._router?.stack || [];
  for (const l of stack) {
    if (l.route?.path) {
      const methods = Object.keys(l.route.methods).join(",");
      console.log("Route:", methods, l.route.path); // e.g., "get /health"
    } else if (l.name === "router" && l.handle?.stack) {
      // Mounted router (like /session)
      for (const s of l.handle.stack) {
        if (s.route?.path) {
          const methods = Object.keys(s.route.methods).join(",");
          console.log("Route:", methods, `/session${s.route.path}`); // e.g., "post /session/init"
        }
      }
    }
  }
}
listRoutes();

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
