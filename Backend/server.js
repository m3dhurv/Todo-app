import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS middleware
app.use(
  cors({
    origin: [
      "https://todo-app-frontend-eta-one.vercel.app", // frontend deployed
      "http://localhost:5173", // local frontend
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Express JSON parser
app.use(express.json());

// ✅ API routes
app.use("/api/todos", todoRoutes);

// ✅ Test route (for CORS and deployment check)
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ CORS and backend are working fine!",
    time: new Date().toISOString(),
  });
});

// ✅ Root check route
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// ✅ Serve frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ✅ Export app for serverless deployment on Vercel
export default app;
