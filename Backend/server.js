import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ CORS setup (frontend + localhost)
app.use(
  cors({
    origin: [
      "https://todo-app-frontend-eta-one.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Express JSON middleware
app.use(express.json());

// ✅ API routes
app.use("/api/todos", todoRoutes);

// ✅ Favicon handling
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ✅ Test route for CORS check
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ CORS is working fine!",
    time: new Date().toISOString(),
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// ✅ Serve frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ✅ Export app for Vercel serverless
export default app;
