import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// JSON parser error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      error: err.message,
    });
  }
  next(err);
});

export default app;