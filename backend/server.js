import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from 'helmet';
import connectDB from "./src/config/db.js";

// Routes
import auth from "./src/routes/auth.js";
import polls from "./src/routes/polls.js";
import votes from './src/routes/votes.js';

// Middleware
import errorHandler from "./src/middlewares/error.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Logger (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API Routes
app.use('/api/auth', auth);
app.use('/api/polls', polls);
app.use('/api/votes', votes);

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "🚀 Quick Poll Maker API running..." });
});

// Error Middleware
app.use(errorHandler);


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} \nServer running at http://localhost:${PORT}/api`
  );
});


