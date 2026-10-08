import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import apiRequestLogger from "./middleware/apiRequestLogger.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiRequestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/events", eventRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "SecureMart backend is running",
    status: "success"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    server: "SecureMart API",
    status: "online",
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SecureMart server running on http://localhost:${PORT}`);
});
