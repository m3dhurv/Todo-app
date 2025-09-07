import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // local frontend (Vite)
  "http://localhost:3000", // local frontend (CRA/Next.js)
  "https://todo-app-frontend-eta-one.vercel.app", // deployed frontend on Vercel
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api/todos", todoRoutes);

// ✅ Serve frontend in production
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// 🔑 No app.listen here (Vercel handles it)
export default app;
