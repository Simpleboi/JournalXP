import { onRequest } from "firebase-functions/v2/https";
import app from "./app";

// Export existing triggers
export * from "./triggers/Auth";
export * from "./triggers/UserView";

// Create an HTTP function that wraps our Express app
// This function will be triggered when HTTP requests are made to our function URL
// The onRequest adapter automatically handles the integration between Firebase Functions and Express
export const api = onRequest(
  {
    memory: "256MiB", // Specify memory allocation
    maxInstances: 10, // Maximum number of function instances
  },
  app
);
