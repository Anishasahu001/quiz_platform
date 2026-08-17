const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const pool = require("../config/db");


// ==========================================
// OVERALL LEADERBOARD
// ==========================================

router.get(
    "/overall",
    authenticateToken,
    authorizeRoles("STUDENT", "ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(`
                SELECT
                    u.id AS student_id,
                    u.name AS student_name,
                    COUNT(qa.id) AS attempts,
                    ROUND(AVG(qa.percentage), 2) AS average_score,
                    MAX(qa.percentage) AS best_score

                FROM users u

                JOIN quiz_attempts qa
                    ON u.id = qa.student_id

                WHERE UPPER(u.role) = 'STUDENT'

                GROUP BY
                    u.id,
                    u.name

                ORDER BY
                    average_score DESC,
                    best_score DESC,
                    attempts DESC
            `);


            const leaderboard = result.rows.map(
                (student, index) => ({
                    rank: index + 1,
                    student_id: student.student_id,
                    student_name: student.student_name,
                    attempts: Number(student.attempts),
                    average_score: Number(student.average_score),
                    best_score: Number(student.best_score)
                })
            );


            res.json({
                success: true,
                leaderboard
            });

        }

        catch (error) {

            console.error(
                "Overall leaderboard error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load overall leaderboard"
            });

        }

    }
);


// ==========================================
// CATEGORY LEADERBOARD
// ==========================================

router.get(
    "/category/:categoryId",
    authenticateToken,
    authorizeRoles("STUDENT", "ADMIN"),
    async (req, res) => {

        try {

            const categoryId =
                req.params.categoryId;


            const result = await pool.query(`
                SELECT
                    u.id AS student_id,
                    u.name AS student_name,
                    COUNT(qa.id) AS attempts,
                    ROUND(AVG(qa.percentage), 2) AS average_score,
                    MAX(qa.percentage) AS best_score

                FROM users u

                JOIN quiz_attempts qa
                    ON u.id = qa.student_id

                JOIN quizzes q
                    ON qa.quiz_id = q.id

                WHERE
                    UPPER(u.role) = 'STUDENT'
                    AND q.category_id = $1

                GROUP BY
                    u.id,
                    u.name

                ORDER BY
                    average_score DESC,
                    best_score DESC,
                    attempts DESC
            `, [categoryId]);


            const leaderboard = result.rows.map(
                (student, index) => ({
                    rank: index + 1,
                    student_id: student.student_id,
                    student_name: student.student_name,
                    attempts: Number(student.attempts),
                    average_score: Number(student.average_score),
                    best_score: Number(student.best_score)
                })
            );


            res.json({
                success: true,
                categoryId,
                leaderboard
            });

        }

        catch (error) {

            console.error(
                "Category leaderboard error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load category leaderboard"
            });

        }

    }
);


module.exports = router;