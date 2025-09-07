import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// Connect DB immediately when server starts
connectDB();

app.use(express.json());

// ✅ Allow frontend domain
app.use(cors({
  origin: ["https://todo-app-frontend-eta-one.vercel.app"], 
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

app.use("/api/todos", todoRoutes);

// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

export default app;
