import dotenv from "dotenv";
dotenv.config();
import "./lib/firebaseAdmin";
import app from "./app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend on ${PORT}`));
