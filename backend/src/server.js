require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const studentRoutes = require("./routes/studentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();

// ==========================================
// CREATE DATABASE TABLES
// ==========================================

async function createTables() {
  try {

    // ==========================================
    // USERS TABLE
    // ==========================================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table ready");


    // ==========================================
    // QUIZZES TABLE
    // ==========================================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        duration INTEGER NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Quizzes table ready");

  } catch (error) {

    console.error("Error creating tables:", error);

  }
}

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Quiz Platform Backend is running"
  });

});

// ==========================================
// DATABASE TEST
// ==========================================

app.get("/api/test-db", async (req, res) => {

  try {

    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });

  }

});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use("/api/admin", adminRoutes);

// ==========================================
// QUIZ ROUTES
// ==========================================

app.use("/api/quizzes", quizRoutes);

// ==========================================
// CATEGORY ROUTES
// ==========================================

app.use("/api/categories", categoryRoutes);

// ==========================================
// QUESTION ROUTES
// ==========================================

app.use("/api/questions", questionRoutes);

// ==========================================
// RESULT ROUTES
// ==========================================

app.use("/api/results", resultRoutes);

// ==========================================
// LEADERBOARD ROUTES
// ==========================================

app.use("/api/leaderboard", leaderboardRoutes);

// ==========================================
// STUDENT ROUTES
// ==========================================

app.use("/api/student", studentRoutes);

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

createTables().then(() => {

  app.listen(PORT, () => {

    console.log(
      `Backend server running on http://localhost:${PORT}`
    );

  });

});