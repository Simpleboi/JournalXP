import { onRequest } from "firebase-functions/v2/https";
import app from "./app";

// Preserve any existing background or event-triggered functions
export * from "./triggers/Auth";
export * from "./triggers/UserView";

// Export the Express app as a single HTTPS function (2nd gen functions)
// Requests to Hosting rewrites like /api/** will be forwarded to this function.
export const api = onRequest(
  {
    memory: "256MiB",
    maxInstances: 10,
  },
  app
);
