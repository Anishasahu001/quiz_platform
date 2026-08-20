const express = require("express");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const pool = require("../config/db");

const router = express.Router();


// ==========================================
// STUDENT - SUBMIT QUIZ
// ==========================================

router.post(
    "/:quizId/submit",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        const client = await pool.connect();

        try {

            const quizId = req.params.quizId;
            const studentId = req.user.id;
            const answers = req.body.answers || {};

            // GET QUESTIONS
            const result = await client.query(
                `SELECT
                    id,
                    correct_answer,
                    explanation
                 FROM questions
                 WHERE quiz_id = $1
                 ORDER BY id ASC`,
                [quizId]
            );

            const questions = result.rows;

            if (questions.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No questions found for this quiz"
                });
            }

            // CALCULATE SCORE
            let score = 0;

            questions.forEach((question) => {

                const studentAnswer = answers[question.id];

                if (
                    studentAnswer !== undefined &&
                    String(studentAnswer).toLowerCase() ===
                    String(question.correct_answer).toLowerCase()
                ) {
                    score++;
                }

            });

            const totalQuestions = questions.length;

            const percentage =
                (score / totalQuestions) * 100;

            const status =
                percentage >= 50
                    ? "PASS"
                    : "FAIL";


            // START TRANSACTION
            await client.query("BEGIN");


            // SAVE ATTEMPT
            const attemptResult = await client.query(
                `INSERT INTO quiz_attempts
                (
                    student_id,
                    quiz_id,
                    score,
                    total_questions,
                    percentage,
                    status
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id`,
                [
                    studentId,
                    quizId,
                    score,
                    totalQuestions,
                    percentage,
                    status
                ]
            );

            const attemptId =
                attemptResult.rows[0].id;


            // SAVE ANSWERS
            for (const question of questions) {

                const selectedAnswer =
                    answers[question.id] ?? null;

                const isCorrect =
                    selectedAnswer !== null &&
                    String(selectedAnswer).toLowerCase() ===
                    String(question.correct_answer).toLowerCase();

                await client.query(
                    `INSERT INTO quiz_answers
                    (
                        attempt_id,
                        question_id,
                        selected_answer,
                        correct_answer,
                        is_correct
                    )
                    VALUES ($1, $2, $3, $4, $5)`,
                    [
                        attemptId,
                        question.id,
                        selectedAnswer,
                        question.correct_answer,
                        isCorrect
                    ]
                );

            }


            // COMMIT
            await client.query("COMMIT");


            // RESPONSE
            res.json({
                success: true,
                message: "Quiz submitted successfully",
                attemptId,
                score,
                totalQuestions,
                percentage,
                status
            });

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Submit quiz error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to submit quiz"
            });

        } finally {

            client.release();

        }

    }
);


// ==========================================
// STUDENT - GET SINGLE QUIZ RESULT
// ==========================================

router.get(
    "/attempt/:attemptId",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const attemptId = req.params.attemptId;
            const studentId = req.user.id;

            const result = await pool.query(
                `SELECT
                    qa.id,
                    qa.quiz_id,
                    qa.score,
                    qa.total_questions,
                    qa.percentage,
                    qa.status
                 FROM quiz_attempts qa
                 WHERE qa.id = $1
                   AND qa.student_id = $2`,
                [
                    attemptId,
                    studentId
                ]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Quiz result not found"
                });

            }

            res.json({
                success: true,
                result: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Get result error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load result"
            });

        }

    }
);


// ==========================================
// ADMIN - GET ALL QUIZ RESULTS
// ==========================================

router.get(
    "/admin/all",
    authenticateToken,
    authorizeRoles("ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    qa.id AS attempt_id,
                    u.name AS student_name,
                    u.email AS student_email,
                    q.title AS quiz_title,
                    qa.score,
                    qa.total_questions,
                    qa.percentage,
                    qa.status,
                    q.created_at
                 FROM quiz_attempts qa
                 JOIN users u
                    ON qa.student_id = u.id
                 JOIN quizzes q
                    ON qa.quiz_id = q.id
                 ORDER BY q.created_at DESC`
            );

            res.json({
                success: true,
                results: result.rows
            });

        } catch (error) {

            console.error(
                "Get admin results error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load results"
            });

        }

    }
);


// ==========================================
// STUDENT - ANSWER REVIEW
// ==========================================

router.get(
    "/attempt/:attemptId/review",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const attemptId = req.params.attemptId;
            const studentId = req.user.id;

            const result = await pool.query(
                `SELECT
                    qa.question_id,
                    q.question_text,
                    q.option_a,
                    q.option_b,
                    q.option_c,
                    q.option_d,
                    qa.selected_answer,
                    qa.correct_answer,
                    qa.is_correct,
                    q.explanation
                 FROM quiz_answers qa
                 JOIN quiz_attempts a
                    ON qa.attempt_id = a.id
                 JOIN questions q
                    ON qa.question_id = q.id
                 WHERE qa.attempt_id = $1
                   AND a.student_id = $2
                 ORDER BY qa.question_id ASC`,
                [
                    attemptId,
                    studentId
                ]
            );

            res.json({
                success: true,
                answers: result.rows
            });

        } catch (error) {

            console.error(
                "Answer review error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load answer review"
            });

        }

    }
);


// ==========================================
// STUDENT - ATTEMPT HISTORY
// ==========================================

router.get(
    "/student/history",
    authenticateToken,
    authorizeRoles("STUDENT"),
    async (req, res) => {

        try {

            const studentId = req.user.id;

            const result = await pool.query(
                `SELECT
                    a.id AS attempt_id,
                    q.title AS quiz_title,
                    a.score,
                    a.total_questions,
                    a.percentage,
                    a.status
                 FROM quiz_attempts a
                 JOIN quizzes q
                    ON a.quiz_id = q.id
                 WHERE a.student_id = $1
                 ORDER BY a.id DESC`,
                [
                    studentId
                ]
            );

            res.json({
                success: true,
                attempts: result.rows
            });

        } catch (error) {

            console.error(
                "Attempt history error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load attempt history"
            });

        }

    }
);


// ==========================================
// ADMIN - ANALYTICS
// ==========================================

router.get(
    "/admin/analytics",
    authenticateToken,
    authorizeRoles("ADMIN"),
    async (req, res) => {

        try {

            // STUDENTS
            const studentResult = await pool.query(`
                SELECT
                    COUNT(*) AS total_students
                FROM users
                WHERE LOWER(role) = 'student'
            `);


            // QUIZZES
            const quizResult = await pool.query(`
                SELECT
                    COUNT(*) AS total_quizzes
                FROM quizzes
            `);


            // ATTEMPTS
            const attemptResult = await pool.query(`
                SELECT
                    COUNT(*) AS total_attempts,
                    COALESCE(AVG(percentage), 0) AS average_score,
                    COALESCE(MAX(percentage), 0) AS highest_score,
                    COALESCE(MIN(percentage), 0) AS lowest_score
                FROM quiz_attempts
            `);


            // PASS / FAIL
            const passFailResult = await pool.query(`
                SELECT
                    COUNT(*) FILTER (
                        WHERE UPPER(status) = 'PASS'
                    ) AS passed,

                    COUNT(*) FILTER (
                        WHERE UPPER(status) = 'FAIL'
                    ) AS failed

                FROM quiz_attempts
            `);


            res.json({

                success: true,

                students: {
                    total:
                        Number(
                            studentResult.rows[0].total_students
                        )
                },

                quizzes: {
                    total:
                        Number(
                            quizResult.rows[0].total_quizzes
                        )
                },

                attempts: {

                    total:
                        Number(
                            attemptResult.rows[0].total_attempts
                        ),

                    averageScore:
                        Number(
                            attemptResult.rows[0].average_score
                        ),

                    highestScore:
                        Number(
                            attemptResult.rows[0].highest_score
                        ),

                    lowestScore:
                        Number(
                            attemptResult.rows[0].lowest_score
                        )

                },

                passFail: {

                    passed:
                        Number(
                            passFailResult.rows[0].passed
                        ),

                    failed:
                        Number(
                            passFailResult.rows[0].failed
                        )

                }

            });

        } catch (error) {

            console.error(
                "Admin analytics error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load analytics"
            });

        }

    }
);


// ==========================================
// ADMIN - QUIZ STATISTICS
// ==========================================

router.get(
    "/admin/quiz-statistics",
    authenticateToken,
    authorizeRoles("ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `
                SELECT
                    q.id AS quiz_id,
                    q.title AS quiz_title,

                    COUNT(a.id) AS total_attempts,

                    COALESCE(
                        ROUND(
                            AVG(a.percentage)::numeric,
                            2
                        ),
                        0
                    ) AS average_score,

                    COALESCE(
                        MAX(a.percentage),
                        0
                    ) AS highest_score,

                    COALESCE(
                        MIN(a.percentage),
                        0
                    ) AS lowest_score,

                    COUNT(
                        CASE
                            WHEN UPPER(a.status) = 'PASS'
                            THEN 1
                        END
                    ) AS passed,

                    COUNT(
                        CASE
                            WHEN UPPER(a.status) = 'FAIL'
                            THEN 1
                        END
                    ) AS failed

                FROM quizzes q

                LEFT JOIN quiz_attempts a
                    ON q.id = a.quiz_id

                GROUP BY
                    q.id,
                    q.title

                ORDER BY
                    q.id DESC
                `
            );

            res.json({
                success: true,
                quizzes: result.rows
            });

        } catch (error) {

            console.error(
                "Quiz statistics error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to load quiz statistics"
            });

        }

    }
);


module.exports = router;