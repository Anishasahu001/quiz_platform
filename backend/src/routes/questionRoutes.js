const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");


// ==========================================
// CREATE QUESTION
// ==========================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createQuestion
);


// ==========================================
// GET QUESTIONS
// ==========================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    getQuestions
);


// ==========================================
// UPDATE QUESTION
// ==========================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateQuestion
);


// ==========================================
// DELETE QUESTION
// ==========================================

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteQuestion
);


module.exports = router;