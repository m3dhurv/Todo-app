import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ Allow frontend domain (CORS)
app.use(
  cors({
    origin: [
      "https://todo-app-frontend-eta-one.vercel.app", // deployed frontend
      "http://localhost:5173", // local dev frontend
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ✅ API route
app.use("/api/todos", todoRoutes);

// ✅ Root check route
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// ✅ Handle production frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

export default app;
