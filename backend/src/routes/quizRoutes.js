const express = require("express");

const router = express.Router();

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  togglePublishQuiz
} = require("../controllers/quizController");

// ==========================================
// CREATE QUIZ
// ==========================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createQuiz
);

// ==========================================
// GET ALL QUIZZES
// ==========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getQuizzes
);
// ==========================================
// EDIT QUIZ
// ==========================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateQuiz
);

// ==========================================
// DELETE QUIZ
// ==========================================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteQuiz
);

// ==========================================
// PUBLISH / UNPUBLISH QUIZ
// ==========================================

router.patch(
  "/:id/publish",
  authenticateToken,
  authorizeRoles("admin"),
  togglePublishQuiz
);

module.exports = router;