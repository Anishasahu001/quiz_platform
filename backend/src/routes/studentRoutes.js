const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const pool = require("../config/db");

const router = express.Router();


// ==========================================
// STUDENT DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("STUDENT"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome to the Student Dashboard",
            user: req.user
        });

    }
);


// ==========================================
// GET PUBLISHED QUIZZES
// ==========================================

router.get(
    "/quizzes",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    id,
                    title,
                    description,
                    duration,
                    published,
                    created_at
                 FROM quizzes
                 WHERE published = true
                 ORDER BY id DESC`
            );


            res.json({
                success: true,
                quizzes: result.rows
            });


        } catch (error) {

            console.error(
                "Get student quizzes error:",
                error
            );


            res.status(500).json({
                success: false,
                message: "Failed to load quizzes"
            });

        }

    }
);

// ==========================================
// GET QUIZ DETAILS
// ==========================================

router.get(
    "/quizzes/:id",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const quizId = req.params.id;

            const result = await pool.query(
                `SELECT
                    id,
                    title,
                    description,
                    duration,
                    published,
                    created_at
                 FROM quizzes
                 WHERE id = $1
                   AND published = true`,
                [quizId]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Quiz not found"
                });

            }

            res.json({
                success: true,
                quiz: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Get quiz details error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load quiz details"
            });

        }

    }
);

// ==========================================
// GET QUESTIONS FOR QUIZ
// ==========================================

router.get(
    "/quizzes/:id/questions",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const quizId = req.params.id;

            // Get quiz
            const quizResult = await pool.query(
                `SELECT
                    id,
                    title,
                    description,
                    duration
                 FROM quizzes
                 WHERE id = $1
                   AND published = true`,
                [quizId]
            );

            if (quizResult.rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Quiz not found"
                });

            }

            // Get questions
            const questionResult = await pool.query(
                `SELECT
                    id,
                    quiz_id,
                    question_text,
                    option_a,
                    option_b,
                    option_c,
                    option_d
                 FROM questions
                 WHERE quiz_id = $1
                 ORDER BY id ASC`,
                [quizId]
            );

            res.json({
                success: true,
                quiz: quizResult.rows[0],
                questions: questionResult.rows
            });

        } catch (error) {

            console.error(
                "Get quiz questions error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load quiz questions"
            });

        }

    }
);


module.exports = router;