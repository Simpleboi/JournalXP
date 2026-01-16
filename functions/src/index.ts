import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/healthRoute";
import sessionRouter from "./routes/session";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import migrateRouter from "./routes/migrate";
import tasksRouter from "./routes/tasks";
import journalsRouter from "./routes/journals";
import habitsRouter from "./routes/habits";
import testRouter from "./routes/test";
import achievementsRouter from "./routes/achievements";
import storeRouter from "./routes/store";
import templatesRouter from "./routes/templates";

// Initialize the express app
// Updated: 2025-11-24 - Fixed date-fns dependency
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


// Create an API router that handles both direct function calls and hosting rewrites
const apiRouter = express.Router();

/**
 * Health check endpoint
 * Used for monitoring and ensuring the service is running
 */
apiRouter.get("/health", healthRouter);
apiRouter.use("/session", sessionRouter);

/**
 * Authentication routes
 * - GET /auth/me - Get current authenticated user
 * - GET /auth/status - Quick auth status check
 */
apiRouter.use("/auth", authRouter);

/**
 * Profile routes
 * - POST /profile/username - Update username
 */
apiRouter.use("/profile", profileRouter);

/**
 * Migration routes (for database schema updates)
 * - POST /migrate/user-fields - Migrate user field names
 * - GET /migrate/status - Check migration status
 */
apiRouter.use("/migrate", migrateRouter);

/**
 * Task management routes
 * - GET /tasks - List all tasks for user
 * - POST /tasks - Create a new task
 * - PATCH /tasks/:id - Update a task
 * - POST /tasks/:id/complete - Mark task as completed
 * - DELETE /tasks/:id - Delete a task
 */
apiRouter.use("/tasks", tasksRouter);

/**
 * Journal entry routes
 * - GET /journals - List all journal entries for user
 * - POST /journals - Create a new journal entry (awards 30 XP)
 * - DELETE /journals/:id - Delete a journal entry
 */
apiRouter.use("/journals", journalsRouter);

/**
 * Habit tracking routes
 * - GET /habits - List all habits for user
 * - GET /habits/completed - List all fully completed habits
 * - POST /habits - Create a new habit
 * - PUT /habits/:id - Update a habit
 * - POST /habits/:id/complete - Mark habit as completed for period (awards XP)
 * - DELETE /habits/:id - Delete a habit
 */
apiRouter.use("/habits", habitsRouter);

/**
 * Test routes (TESTING ONLY)
 * - POST /test/award-xp - Award arbitrary XP to user for testing
 * - POST /test/reset-progress - Reset user progress to default starter values
 */
apiRouter.use("/test", testRouter);

/**
 * Achievement routes
 * - GET /achievements - Get all achievements with unlocked status
 * - GET /achievements/:id - Get specific achievement
 * - POST /achievements/unlock/:id - Manually unlock special achievement
 */
apiRouter.use("/achievements", achievementsRouter);

/**
 * Store routes
 * - POST /store/purchase - Purchase an item from the store
 */
apiRouter.use("/store", storeRouter);

/**
 * Template routes
 * - GET /templates - Get all templates (pre-built + custom)
 * - GET /templates/prebuilt - Get all pre-built templates
 * - GET /templates/:id - Get specific template
 * - POST /templates - Create custom template
 * - PUT /templates/:id - Update custom template
 * - DELETE /templates/:id - Delete custom template
 * - POST /templates/:id/use - Track template usage
 * - GET /templates/preferences/me - Get user template preferences
 * - PUT /templates/preferences/me - Update template preferences
 * - POST /templates/:id/favorite - Toggle favorite status
 */
apiRouter.use("/templates", templatesRouter);

/**
 * Test endpoint for direct session initialization
 * Can be used for debugging without middleware
 */
apiRouter.post("/session/init-direct", (_req, res) => {
  res.json({ ok: true, route: "init-direct" });
});

// Mount the API router at /api for Firebase Hosting rewrites
app.use("/api", apiRouter);

// mount routes at root level for direct function invocations
app.get("/health", healthRouter);
app.use("/session", sessionRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/migrate", migrateRouter);
app.use("/tasks", tasksRouter);
app.use("/journals", journalsRouter);
app.use("/habits", habitsRouter);
app.use("/test", testRouter);
app.use("/achievements", achievementsRouter);
app.use("/store", storeRouter);
app.use("/templates", templatesRouter);


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

// List routes in all environments for debugging
listRoutes();

export const api = onRequest(
  {
    cors: false,
    region: "us-central1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 10,
    minInstances: 1,
  },
  app
);

/**
 * Sunday AI Therapist - Callable function for chat
 * UPDATED: Now uses summary-based context loading
 */
export { jxpChat } from "./sunday-new";

/**
 * Summarization Cloud Functions
 * These run automatically to maintain user summaries
 */
export { updateRecentJournalSummary } from "./summarization/journalSummary";
export { updateHabitTaskSummaryScheduled } from "./summarization/habitTaskSummary";
