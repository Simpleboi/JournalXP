import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/healthRoute";
import sessionRouter from "./routes/session";
import authRouter from "./routes/auth";
import migrateRouter from "./routes/migrate";
import tasksRouter from "./routes/tasks";

// Initialize the express app
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log authentication method for debugging
  if (req.headers.authorization) {
    console.log("  → Auth: Bearer token");
  } else if (req.cookies?.__session) {
    console.log("  → Auth: Session cookie");
  }

  next();
});


/**
 * Health check endpoint
 * Used for monitoring and ensuring the service is running
 */
app.get("/health", healthRouter);
app.use("/session", sessionRouter);

/**
 * Authentication routes
 * - GET /auth/me - Get current authenticated user
 * - GET /auth/status - Quick auth status check
 */
app.use("/auth", authRouter);

/**
 * Migration routes (for database schema updates)
 * - POST /migrate/user-fields - Migrate user field names
 * - GET /migrate/status - Check migration status
 */
app.use("/migrate", migrateRouter);

/**
 * Task management routes
 * - GET /tasks - List all tasks for user
 * - POST /tasks - Create a new task
 * - PATCH /tasks/:id - Update a task
 * - POST /tasks/:id/complete - Mark task as completed
 * - DELETE /tasks/:id - Delete a task
 */
app.use("/tasks", tasksRouter);

/**
 * Test endpoint for direct session initialization
 * Can be used for debugging without middleware
 */
app.post("/session/init-direct", (_req, res) => {
  res.json({ ok: true, route: "init-direct" });
});


/**
 * 404 Handler - Route not found
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    details: `Route ${req.method} ${req.path} does not exist`,
    code: "ROUTE_NOT_FOUND",
  });
});

/**
 * Global error handler
 * Catches any unhandled errors and returns consistent error response
 */
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    code: err.code || "INTERNAL_ERROR",
  });
});


/**
 * List all registered routes for debugging
 * This helps verify that routes are correctly mounted
 */
function listRoutes() {
  console.log("\n📋 Registered Routes:");
  console.log("====================");

  // @ts-ignore - Access internal router stack for debugging
  const stack = app._router?.stack || [];

  for (const layer of stack) {
    if (layer.route?.path) {
      // Direct route
      const methods = Object.keys(layer.route.methods)
        .join(",")
        .toUpperCase();
      console.log(`  ${methods.padEnd(7)} ${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle?.stack) {
      // Mounted router (like /session or /auth)
      const basePath = layer.regexp
        .toString()
        .match(/^\/\^\\\/(.+?)\\/)?.[1] || "";

      for (const subLayer of layer.handle.stack) {
        if (subLayer.route?.path) {
          const methods = Object.keys(subLayer.route.methods)
            .join(",")
            .toUpperCase();
          const fullPath = `/${basePath}${subLayer.route.path}`;
          console.log(`  ${methods.padEnd(7)} ${fullPath}`);
        }
      }
    }
  }

  console.log("====================\n");
}

// Only list routes in development
if (process.env.NODE_ENV !== "production") {
  listRoutes();
}

export const api = onRequest(
  {
    cors: false, 
    region: "us-central1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 10,
  },
  app
);
