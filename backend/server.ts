import admin from "firebase-admin";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

// Default route
app.get("/", (_, res) => res.send("✅ JournalXP Backend Running"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));